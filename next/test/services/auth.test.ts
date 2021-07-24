import { hash, verifyHash } from "../../services/auth/password"
import bcrypt from "bcrypt"
import { minBcryptRounds } from "../../services/config/server/password"
import { expect } from "chai"
import { mock, SinonSpy, spy, stub } from "sinon"
import { seal, unseal } from "../../services/auth/iron"
import { getSession, refreshSession, removeSession } from "../../services/auth/auth-cookie"
import { NextApiRequest, NextApiResponse } from "next"
import { parse } from "cookie"
import * as dotenv from "dotenv";
import { sessionCookieMaxAge } from "../../services/config/shared/config"

const cookie = require("cookie")

async function asyncThrows(promise: Promise<any>, promisedError?: string | Error) {
    let error: any;
    try {
        await promise;
    } catch (e) {
        error = e;
    }
    expect(error, "It must throw").to.not.be.undefined;
    if (promisedError !== undefined) expect(error, `Expected the error to be '${promisedError}'`).to.equal(promisedError);
}

describe("password.ts", function () {
    describe("#hash()", function () {
        it("Should return a hash string of length 60", async function () {
            expect(await hash("test")).to.be.a("string").and.to.have.lengthOf(60)
        })

        it("Should have the right rounds value", async function () {
            const h = await hash("test");
            const detectedRounds = await bcrypt.getRounds(h);
            expect(detectedRounds).to.equal(minBcryptRounds);
        })
    })

    describe("#verifyHash()", async function () {

        it("Should return true when the password is correct and skip calling the updateHash function", async function () {
            const h = await hash("test");
            const writeSpy = spy(() => { });

            const comparisonResult = await verifyHash(h, "test", writeSpy)

            expect(comparisonResult, "The hash should be classified as correct").to.be.true;
            expect(writeSpy.notCalled, "The callback should not be called").to.be.true;
        })

        it("Should return false when the password is incorrect and skip calling the updateHash function", async function () {
            const h = await hash("test");
            const writeSpy = spy(() => { });

            const comparisonResult = await verifyHash(h, "not test", writeSpy);

            expect(comparisonResult, "The hash should be classified as incorrect").to.be.false;
            expect(writeSpy.notCalled, "The callback should not be called").to.be.true;
        })

        it("Should rehash the password, only if it is correct and has too few rounds", async function () {

            const writeSpy = spy((value) => { });

            const h = await bcrypt.hash("test", 4);
            await verifyHash(h, "test", writeSpy);

            expect(writeSpy.calledOnce, "The value needs to be rehashed").to.be.true;
            expect(writeSpy.firstCall.firstArg, "The hash needs to still be a hash of the same password").to.satisfy(async function (newHash: string) {
                return await bcrypt.compare("test", newHash)
            })
            expect(writeSpy.firstCall.firstArg, "The hash needs to have the required rounds value").to.satisfy(async function (newHash: string) {
                return await bcrypt.getRounds(newHash) === minBcryptRounds;
            })

            writeSpy.resetHistory()

            await verifyHash(h, "not test", writeSpy);

            expect(writeSpy.notCalled, "The value can not be rehashed if the password is wrong").to.be.true;
        })
    })
})

describe("iron.ts", function () {
    describe("#seal(), #unseal()", function () {
        it("should recover data JSON data as it was", async function () {
            const input = {
                test: 4,
                nested: {
                    eight: 8
                },
                str: "string here"
            }
            const result = await seal(input)
            expect(await unseal(result)).to.be.deep.equal(input);
        })

        it("should recover data string data as it was", async function () {
            const input = "test test";
            const result = await seal(input)
            expect(await unseal(result)).to.equal(input);
        })

        describe("without a proper key: ", function () {

            // reset the variables
            this.afterAll(() => dotenv.config({
                path: "./.env.local"
            }))

            it("should throw if the key is not defined or is invalid", async function () {
                delete process.env.IRON_KEY;
                const input = "test test";
                asyncThrows(seal(input), "Iron key is undefined")
                asyncThrows(unseal(input), "Iron key is undefined");
            })
        })
    })
})

describe("auth-cookies.ts", function () {
    describe("#getSession()", function () {

        it("should return null when there are no cookies available", async function () {

            expect(await getSession({} as NextApiRequest)).to.equal(null);
        })

        it("should return null when the data can not be unsealed", async function () {

            expect(await getSession({
                cookies: {
                    session: "can not be parsed"
                }
            } as unknown as NextApiRequest)).to.equal(null);
        })

        it("should return the unsealed data when it can be unsealed", async function () {
            const dataToSeal = "this data can be parsed";

            expect(await getSession({
                cookies: {
                    session: await seal(dataToSeal)
                }
            } as unknown as NextApiRequest)).to.equal(dataToSeal);
        })
    })

    describe("#refreshSession(), #createSession()", function () {

        const resStub = {
            setHeader: (name: string, data: any) => { }
        } as NextApiResponse;
        let resSpy: SinonSpy;

        this.beforeEach(function () {
            resSpy = spy(resStub, "setHeader");
        })

        this.afterEach(function () {
            resSpy.restore()
        })

        it("should set two cookies", async function () {

            await refreshSession(resStub, "data");


            expect(resSpy.called, "the callback must have been called").to.be.true;
            expect(resSpy.args[0].length, "it needs to set two cookies").to.equal(2);
            const args = resSpy.args
        })

        it("should have correct cookie data", async function () {
            const dataToSeal = "some data"
            await refreshSession(resStub, dataToSeal);

            const cookieData = resSpy.args[0][1];
            const cookie1 = parse(cookieData[0]);
            const cookie2 = parse(cookieData[1]);

            expect(await unseal(cookie1.session), "the data should be preserved").to.be.equal(dataToSeal);
            expect(cookie2.isSessionActive, "the session should be set to active").to.be.equal("true");
        })

        it("should set correct cookie options", async function () {
            const serialiseSpy = spy(cookie, "serialize");

            await refreshSession(resStub, "some data");

            expect(serialiseSpy.calledTwice, "the cookie needs to be set twice").to.be.true;

            const cookie1 = serialiseSpy.args[0][2];
            const cookie2 = serialiseSpy.args[1][2];

            expect(cookie1).to.deep.equal({
                maxAge: sessionCookieMaxAge,
                httpOnly: true,
                sameSite: "strict",
                secure: true,
                path: "/"
            })

            expect(cookie2).to.deep.equal({
                maxAge: sessionCookieMaxAge,
                sameSite: "strict",
                secure: true,
                path: "/"
            })

            serialiseSpy.restore()
        })
    })

    describe("#removeSession()", function () {

        const resStub = {
            setHeader: (name: string, data: any) => { }
        } as NextApiResponse;
        let resSpy: SinonSpy;

        this.beforeEach(function () {
            resSpy = spy(resStub, "setHeader");
        })

        this.afterEach(function () {
            resSpy.restore()
        })

        it("should set two cookies", async function () {

            await removeSession(resStub);


            expect(resSpy.called, "the callback must have been called").to.be.true;
            expect(resSpy.args[0].length, "it needs to set two cookies").to.equal(2);
            const args = resSpy.args
        })

        it("should have empty cookie data", async function () {
            await removeSession(resStub);

            const cookieData = resSpy.args[0][1];
            const cookie1 = parse(cookieData[0]);
            const cookie2 = parse(cookieData[1]);

            expect(cookie1.session, "the data should be empty").to.be.equal("");
            expect(cookie2.isSessionActive, "the data should be empty").to.be.equal("");
        })

        it("should set correct cookie options", async function () {
            const serialiseSpy = spy(cookie, "serialize");

            await removeSession(resStub);

            expect(serialiseSpy.calledTwice, "the cookie needs to be set twice").to.be.true;

            const cookie1 = serialiseSpy.args[0][2];
            const cookie2 = serialiseSpy.args[1][2];

            const targetValues = {
                maxAge: -1,
                path: "/"
            }

            expect(cookie1).to.deep.equal(targetValues)

            expect(cookie2).to.deep.equal(targetValues)

            serialiseSpy.restore()
        })
    })
})
