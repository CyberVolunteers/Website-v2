import Sinon, { restore, spy, stub } from "sinon"
import { expect } from "chai"
import { createValidateMiddleware, createValidation, isDescendingOrder, isExactLength, isMaxLength, numberValidate, stringValidate } from "../../services/schemaParser/mongoValidateUtils"
import { constructSchema, deepAssign } from "../../services/schemaParser/mongoSchemas"
import { FieldConstraintsCollection } from "../../services/config/shared/FieldTypes"
import { SchemaDefinition } from "mongoose"

const mongoose = require("mongoose"); // for stubbing

describe("mongoValidateUtils.ts", function () {

    describe("creator functions", function () {
        describe("#createValidation()", function () {
            const arrowFunctionSpy = spy(() => false);
            const testArgs = ["testarg1", { test: "testarg2" }];
            const out = createValidation("Error message", arrowFunctionSpy)(...testArgs);
            out.validator("value");

            it("Should create a correct validation structure", function () {
                expect(out).to.have.all.keys("message", "validator")
            })
            it("should pass all the pre-defined arguments, with the first one being the value from the call arguments", function () {
                expect(arrowFunctionSpy.args[0]).to.have.ordered.members(["value", ...testArgs])
            })
            it("should return exactly what the predicate returned", function () {
                expect(arrowFunctionSpy.returnValues[0]).to.be.false;
            })
            it("Should call the callback on validation", function () {
                expect(arrowFunctionSpy.calledOnce, "the callback must be called once").to.be.true;
            })
        })

        describe("#createValidateMiddleware()", function () {

            function createSpy(returnValue: boolean, automaticResponseToUndefined: boolean | null, obj: any) {
                const spyFun = spy(function (mappedArgs: any[], obj: any, fields: any[]) {
                    return returnValue;
                });
                const nextSpy = spy(() => { })
                const middlewareFun = createValidateMiddleware("Error message", automaticResponseToUndefined, spyFun)(["testName1", "testName2"]);
                middlewareFun.bind(obj)(nextSpy);
                return [spyFun, nextSpy];
            }

            it("should return true if called with all arguments present", function () {
                const [spyFun, nextSpy] = createSpy(true, false, { testName1: 3, testName2: 4 });

                expect(spyFun.calledOnce, "the callback only needs to be called once").to.be.true;
                expect(spyFun.returnValues[0], "the return value needs to be true").to.be.true;
            })

            it("should fail if the predicate fails", function () {
                const triggerCreateSpy = () => createSpy(false, false, { testName1: 3, testName2: 4 });

                expect(triggerCreateSpy).to.throw("Fields for validation:");
            })

            it("should fail if one of the values is undefined and 'automaticResponseToUndefined' is set to false", function () {
                const triggerCreateSpy = () => createSpy(true, false, { testName1: 3 });

                expect(triggerCreateSpy).to.throw("Fields for validation:");
            })

            it("should keep going if one of the values is undefined and 'automaticResponseToUndefined' is set to null", function () {
                const [spyFun, nextSpy] = createSpy(true, null, { testName1: 3 });

                expect(spyFun.calledOnce, "the predicate should be called").to.be.true;
                expect(nextSpy.calledOnce, "the function must return next()").to.be.true;
            })

            it("should return true if one of the values is undefined and 'automaticResponseToUndefined' is set to true, without calling the predicate", function () {
                const [spyFun, nextSpy] = createSpy(true, true, { testName1: 3 });

                expect(spyFun.notCalled, "the predicate should not be called").to.be.true;
                expect(nextSpy.calledOnce, "the function must return next()").to.be.true;
            })

            it("should provide correct arguments to the callback", function () {
                const [spyFun, nextSpy] = createSpy(true, false, { testName1: 3, testName2: 4 });

                expect(spyFun.calledOnce, "the callback only needs to be called once").to.be.true;
                expect(spyFun.args[0], "the arguments need to be able to be mapped").to.satisfy((args: [any[], any, any[]]) => {
                    const [resolvedFields, toValidate, fields] = args;
                    const calculatedFields = fields.map(k => toValidate[k]);
                    expect(calculatedFields, "toValidate should contain key:value pairs corresponding to fields and resolved args").to.have.ordered.members(resolvedFields);
                    return true;
                });
            })
        })
    })

    describe("Predicates", function () {
        describe("#isAscendingOrder", function () {
            it("Should return true when every value is greater than the preceding one", function () {
                expect(isDescendingOrder([6, 5, 4, 3, 2, 1])).to.be.true;
            })
            it("Should return false when the values are in neither ascending nor descending order", function () {
                expect(isDescendingOrder([4, 10, 3, 9])).to.be.false;
            })
            it("Should return false when the values are in ascending order", function () {
                expect(isDescendingOrder([1, 2, 3, 4, 5, 6])).to.be.false;
            })
        })

        describe("#exactLength()", function () {
            it("should return true when the length matches", function () {
                expect(isExactLength("1234", 4)).to.be.true;
            })
            it("should return false if the length is different", function () {
                expect(isExactLength("1234", 1)).to.be.false;
                expect(isExactLength("1234", 10)).to.be.false;
            })
        })

        describe("#maxLength()", function () {
            it("should return true when the length matches or is smaller", function () {
                expect(isMaxLength("1234", 4)).to.be.true;
                expect(isMaxLength("12", 4)).to.be.true;
            })
            it("should return false if the length is different", function () {
                expect(isMaxLength("123456", 4)).to.be.false;
            })
        })
    })
})



describe("mongoSchemas.js", function () {
    describe("#deepAssign()", function () {
        it("should prefer src with non-indexable arguments", async function () {
            expect(deepAssign(1, 2)).to.equal(2);
            expect(deepAssign(undefined, 2)).to.equal(2);
            expect(deepAssign(1, undefined)).to.equal(1);
        })

        it("should determine the return type based on the first argument", async function () {
            expect(deepAssign([], {})).to.deep.equal([]);
            expect(deepAssign([], [])).to.deep.equal([]);
            expect(deepAssign({}, {})).to.deep.equal({});
            expect(deepAssign({}, [])).to.deep.equal({});
        })

        it("should copy and override properties", async function () {
            expect(deepAssign({ test: 4 }, { test2: 5 })).to.deep.equal({
                test: 4,
                test2: 5
            });
            expect(deepAssign({ test: 4 }, { test: 5 })).to.deep.equal({
                test: 5
            });
            expect(deepAssign({ test: 4 }, [4])).to.deep.equal({
                test: 4,
                0: 4
            });
            expect(deepAssign([4], { 0: 5 })).to.deep.equal([5]);
        })

        it("should copy and override properties recursively", function () {
            expect(deepAssign({ test: 4, rec: { value: 4 } }, { test2: 5, otherRec: { value: 5 } })).to.deep.equal({
                test: 4,
                test2: 5,
                rec: { value: 4 },
                otherRec: { value: 5 },
            });
            expect(deepAssign({ test: 4, rec: { value: 4 } }, { test2: 5, rec: { value: 5 } })).to.deep.equal({
                test: 4,
                test2: 5,
                rec: { value: 5 },
            });

            expect(deepAssign({ test: 4, rec: { value: 4 } }, { test2: 5, rec: {} })).to.deep.equal({
                test: 4,
                test2: 5,
                rec: { value: 4 },
            });
        })
    })

    describe("#constructSchemaSettings()", function () {
        let schemaSpy: Sinon.SinonStub<any[], any>;

        this.beforeEach(function () {
            // stub the dependency
            schemaSpy = stub(mongoose, "Schema").callsFake((args) => args);
            const stringMaxLengthSpy = stub(stringValidate, "maxLength").callsFake((args) => `maxLen${args}` as any);
            const stringExactLengthSpy = stub(stringValidate, "exactLength").callsFake((args) => `exactLength${args}` as any);
            const numberGreaterOrEqualToSpy = stub(numberValidate, "greaterOrEqualTo").callsFake((args) => `greaterOrEqualTo${args}` as any);
        })

        this.afterEach(function () {
            restore();
        })

        it("should correctly assign types", function () {
            const o: FieldConstraintsCollection = {
                required: {
                    string: {
                        str: {}
                    },
                    number: {
                        num: {}
                    },
                    boolean: {
                        bool: {}
                    },
                    date: {
                        dat: {}
                    },
                    object: {
                        obj: {
                            required: {
                                string: {
                                    test: {}
                                }
                            }
                        }
                    }
                },
            }

            const expected: SchemaDefinition<any> = {
                str: {
                    type: String,
                    required: true,
                },
                num: {
                    type: Number,
                    required: true,
                },
                dat: {
                    type: Date,
                    required: true,
                },
                bool: {
                    type: Boolean,
                    required: true,
                },
                obj: {
                    required: true,
                    type: new mongoose.Schema({
                        test: {
                            type: String,
                            required: true
                        }
                    })
                },
            }
            expect(constructSchema(o)).to.deep.equal(expected)
        })

        it("should correctly process enums", function () {
            const o: FieldConstraintsCollection = {
                required: {
                    string: {
                        names: {
                            enum: ["A", "B", "C"]
                        }
                    }
                },
            }

            const expected: SchemaDefinition<any> = {
                names: {
                    type: String,
                    required: true,
                    enum: ["A", "B", "C"]
                },
            }

            expect(constructSchema(o)).to.deep.equal(new mongoose.Schema(expected))
        })

        it("should correctly process unique values", function () {
            const o: FieldConstraintsCollection = {
                required: {
                    string: {
                        name: {
                            unique: true
                        }
                    }
                },
            }

            const expected: SchemaDefinition<any> = {
                name: {
                    type: String,
                    required: true,
                    unique: true
                },
            }

            expect(constructSchema(o)).to.deep.equal(new mongoose.Schema(expected))
        })

        it("should correctly process defaults", function () {
            const o: FieldConstraintsCollection = {
                optional: {
                    string: {
                        names: {
                            default: "hey"
                        }
                    }
                },
            }

            const expected: SchemaDefinition<any> = {
                names: {
                    type: String,
                    required: false,
                    default: "hey"
                },
            }

            expect(constructSchema(o)).to.deep.equal(new mongoose.Schema(expected))
        })

        it("should correctly process 'required' and 'optional'", function () {
            const o: FieldConstraintsCollection = {
                required: {
                    string: {
                        name1: { maxLength: 4 }
                    }
                },
                optional: {
                    string: {
                        name2: {}
                    }
                }
            }

            const expected: SchemaDefinition<any> = {
                name1: {
                    type: String,
                    required: true,
                    validate: stringValidate.maxLength(4),
                },
                name2: {
                    type: String,
                    required: false,
                },
            }

            expect(constructSchema(o)).to.deep.equal(new mongoose.Schema(expected))
        })

        it("should merge the two passed objects", function () {
            const o1: FieldConstraintsCollection = {
                required: {
                    string: {
                        name1: { maxLength: 4 }
                    }
                },
                optional: {
                    string: {
                        name2: { lazyFill: true }
                    }
                }
            }

            const o2: FieldConstraintsCollection = {
                optional: {
                    string: {
                        name2: { maxLength: 9 },
                        secret: {}
                    }
                }
            }

            const expected: SchemaDefinition<any> = {
                name1: {
                    type: String,
                    required: true,
                    validate: stringValidate.maxLength(4),
                },
                name2: {
                    type: String,
                    required: false,
                    validate: stringValidate.maxLength(9),
                },
                secret: {
                    type: String,
                    required: false,
                },
            }

            expect(constructSchema(o1, o2)).to.deep.equal(new mongoose.Schema(expected))
        })

        it("Should set correct validation functions", function () {
            const pre = spy(() => { })
            schemaSpy.callsFake((args) => {
                return Object.assign(args, {
                    pre
                })
            })
            const o: FieldConstraintsCollection = {
                required: {
                    string: {
                        name1: { maxLength: 4 },
                        name2: { exactLength: 4 }
                    },
                    number: {
                        num1: { greaterOrEqualTo: "num2" },
                        num2: {}
                    }
                },
            }

            const expected: SchemaDefinition<any> = {
                name1: {
                    type: String,
                    required: true,
                    validate: stringValidate.maxLength(4),
                },
                name2: {
                    type: String,
                    required: true,
                    validate: stringValidate.exactLength(4),
                },
                num1: {
                    type: Number,
                    required: true,
                },
                num2: {
                    type: Number,
                    required: true
                },
                pre
            }

            expect(constructSchema(o)).to.deep.equal(expected);
            expect(pre.callCount).to.equal(1);
            expect(pre.args).to.deep.include(["validate", numberValidate.greaterOrEqualTo(["num1", "num2"])]);
        })
    })
})