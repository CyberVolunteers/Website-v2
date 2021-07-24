import { expect } from "chai"
import { mergeWithCallback } from "../../lib/utils/security"

describe("security.ts", function () {
    const legitimateInputObjs = [
        {
            test: 3,
            test2: {
                test3: "test",
                nested: {
                    value: "test"
                },
                array: ["yes", "no"]
            },
            nul: null,
            undef: undefined,
            bool: true,
            bool2: false,
            bigint: 123456787543224567542113456753n,
            symbol: Symbol("test"),
            fun: function () { },
            dat: new Date(322)
        },
        3,
        [3, "test", {
            val: "value"
        }]
    ]

    describe("#mergeWithCallback()", function () {
        it("should not change legitimate inputs", function () {

            Object.values(legitimateInputObjs).forEach(value => {
                expect(mergeWithCallback(value, (k: any, v: any) => [k, v])).to.deep.equal(value)
            })
        })
    })
})