import path from 'path';
import chai from 'chai';
import {fs} from 'memfs';

import {DATAJSON, USERJSON} from '../../../params';
import {readJSON, writeJSON} from '../../../utils/files/json';
import {UtilsFilesJSONTestDir} from "../../setup.test";

const {repositoryDir, nonRepositoryDir} = UtilsFilesJSONTestDir;

let assert = chai.assert;

describe("JSON", () => {
    const TESTJSON = path.resolve(repositoryDir, 'test.json')

    it("success write", () => {
        let obj = {
            a: "test",
            b: "success",
            c: true,
        }
        writeJSON(TESTJSON, obj);
        const file = JSON.parse(fs.readFileSync(TESTJSON))
        assert.deepEqual(file, obj)
    })

    it("fail write", () => {
        let obj = {
            a: "fail",
            b: "invalid file path",
            c: false,
        }
        assert.throws(() => writeJSON(nonRepositoryDir, obj), "EISDIR: illegal operation on a directory, open '/utils/files/json/non-repo'")
    })

    it("success read", () => {
        const result = readJSON(TESTJSON);
        const file = JSON.parse(fs.readFileSync(TESTJSON))
        assert.deepEqual(result, file)
    })

    it("fail read", () => {
        assert.throws(() => readJSON(nonRepositoryDir), "EISDIR: illegal operation on a directory, open '/utils/files/json/non-repo'")
    })
})
