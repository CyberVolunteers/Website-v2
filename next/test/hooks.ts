import sinon from "sinon";
import * as dotenv from "dotenv";

// Restores the default sandbox after every test
export const mochaHooks = {
	beforeAll() {
		dotenv.config({
			path: "./.env.local",
		});
	},

	afterEach() {
		sinon.restore();
	},
};
