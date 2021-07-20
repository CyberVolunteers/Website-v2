import { hash, verifyHash } from "../../services/auth/password"
import bcrypt from "bcrypt"
import { minBcryptRounds } from "../../services/config/server/password"
import { expect } from "chai"
import { spy } from "sinon"
// import assert from "assert"

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