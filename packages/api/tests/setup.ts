import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot";

chai.use(chaiAsPromised);
chai.use(jestSnapshotPlugin());
