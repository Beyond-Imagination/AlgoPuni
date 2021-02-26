import path from 'path';
import chai from 'chai';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {DATAJSON, USERJSON} from '../../../src/params';
import {createRepository} from '../../../src/utils/files/repository';
import Data from '../../../src/lib/context/data';

const repositoryDir = path.resolve("/","lib","context","data","repo");
const nonRepositoryDir = path.resolve("/","lib","context","data","non-repo");

let assert = chai.assert;

describe("data.json", () => {
    before(() => {
        vol.mkdirSync(repositoryDir, {recursive: true})
        vol.mkdirSync(nonRepositoryDir, {recursive: true})
        patchFs(vol);
        createRepository(repositoryDir);
    })

    it("success create", () => {
        const data = new Data(repositoryDir);
        data.create();
        assert.equal(repositoryDir, data.repository)
        assert.equal(path.resolve(repositoryDir, DATAJSON), data.path)
        assert.isObject(data.users)
        assert.isArray(data.problems.challenging)
        assert.isArray(data.problems.archived)
        assert.isArray(data.problems.thisWeek)
        const isExist = fs.existsSync(path.resolve(repositoryDir, DATAJSON))
        assert.isTrue(isExist, "fail to create data json")
    })

    it("fail create", () => {
        const data = new Data(nonRepositoryDir);
        assert.throws(() => data.create());
    })

    it("success read", () => {
        const data = new Data(repositoryDir);
        data.read();
        assert.isObject(data.users)
        assert.isArray(data.problems.challenging)
        assert.isArray(data.problems.archived)
        assert.isArray(data.problems.thisWeek)
    })

    it("fail read", () => {
        const data = new Data(nonRepositoryDir);
        assert.throws(() => data.read())
    })

    it("success write", () => {
        const data = new Data(repositoryDir);
        data.users = {
            laggu: {
                challenging: [1,2,3],
            },
        };
        data.problems = {
            challenging: [11,12,13],
            archived: [21,22,23],
            thisWeek: [31,32,33],
        }
        data.write();
        const result = JSON.parse(fs.readFileSync(path.resolve(repositoryDir, DATAJSON)))
        assert.deepEqual(result, data.toJSON())
    })

    it("fail write", () => {
        const data = new Data(nonRepositoryDir);
        data.users = {
            laggu: {
                challenging: [1,2,3],
            },
        };
        data.problems = {
            challenging: [11,12,13],
            archived: [21,22,23],
            thisWeek: [31,32,33],
        }
        assert.throws(() => data.write())
    })
})
