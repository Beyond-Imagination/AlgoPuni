import path from 'path';
import chai from 'chai';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {DATAJSON, USERJSON} from '../../../src/params';
import {readJSON, writeJSON} from '../../../src/utils/files/json';

const repositoryDir = path.resolve("/","utils","files","json","repo");
const nonRepositoryDir = path.resolve("/","utils","files","json","non-repo");

let assert = chai.assert;

describe("JSON", () => {
    const TESTJSON = path.resolve(repositoryDir, 'test.json')

    before(() => {
        vol.mkdirSync(repositoryDir, {recursive: true})
        vol.mkdirSync(nonRepositoryDir, {recursive: true})
        patchFs(vol);
    })

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
