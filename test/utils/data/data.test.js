import path from 'path';
import chai from 'chai';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {DATAJSON, USERJSON} from '../../../params';
import {createRepository} from '../../../utils/files/repository';
import {createDataJSON, readDataJSON, writeDataJSON} from '../../../utils/data/data';

const repositoryDir = path.resolve("/","utils","data","data","repo");
const nonRepositoryDir = path.resolve("/","utils","data","data","non-repo");

let assert = chai.assert;

describe("data.json", () => {
    before(() => {
        vol.mkdirSync(repositoryDir, {recursive: true})
        vol.mkdirSync(nonRepositoryDir, {recursive: true})
        patchFs(vol);
        createRepository(repositoryDir);
    })

    it("success create", () => {
        const data = createDataJSON(repositoryDir);
        assert.isObject(data.users)
        assert.isArray(data.problems.challenging)
        assert.isArray(data.problems.archived)
        assert.isArray(data.problems.this_week)
        const isExist = fs.existsSync(path.resolve(repositoryDir, DATAJSON))
        assert.isTrue(isExist, "fail to create data json")
    })

    it("fail create", () => {
        assert.throws(() => createDataJSON(), "no AlgoPuni repository found", "should fail finding repository");
    })

    it("success read", () => {
        const data = readDataJSON(repositoryDir);
        assert.isObject(data.users)
        assert.isArray(data.problems.challenging)
        assert.isArray(data.problems.archived)
        assert.isArray(data.problems.this_week)
    })

    it("fail read", () => {
        assert.throws(() => readDataJSON(nonRepositoryDir), `ENOENT: no such file or directory, open '/utils/data/data/non-repo/.algopuni/data.json'`)
    })

    it("success write", () => {
        const data = {
            users: {
                laggu: {
                    challenging: [1,2,3],
                },
            },
            problems: {
                challenging: [11,12,13],
                archived: [21,22,23],
                this_week: [31,32,33],
            },
        }
        writeDataJSON(data, repositoryDir);
        const result = JSON.parse(fs.readFileSync(path.resolve(repositoryDir, DATAJSON)))
        assert.deepEqual(result, data)
    })

    it("fail write", () => {
        const data = {
            users: {
                laggu: {
                    challenging: [1,2,3],
                },
            },
            problems: {
                challenging: [11,12,13],
                archived: [21,22,23],
                this_week: [31,32,33],
            },
        }
        assert.throws(() => writeDataJSON(data, nonRepositoryDir), `ENOENT: no such file or directory, open '/utils/data/data/non-repo/.algopuni/data.json'`)
    })
})
