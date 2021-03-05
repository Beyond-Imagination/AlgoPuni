import path from 'path';
import chai from 'chai';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';
import faker from 'faker';

import {DATAJSON, USERJSON} from '../../../src/params';
import {createRepository} from '../../../src/utils/files/repository';
import {ErrorExistDataJSON, ErrorSameUserIDAsBefore, ErrorExistUserID, ErrorReadFile, ErrorWriteFile} from '../../../src/utils/error';
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
        assert.isArray(data.problems.unsolved)
        assert.isArray(data.problems.archived)
        assert.isArray(data.problems.thisWeek)
        const isExist = fs.existsSync(path.resolve(repositoryDir, DATAJSON))
        assert.isTrue(isExist, "fail to create data json")
    })

    it("fail create with exist data.json", () => {
        const data = new Data(repositoryDir);
        assert.throws(()=>data.create(), ErrorExistDataJSON);
    })

    it("fail create", () => {
        const data = new Data(nonRepositoryDir);
        assert.throws(() => data.create(), ErrorWriteFile);
    })

    it("success read", () => {
        const data = new Data(repositoryDir);
        data.read();
        assert.isObject(data.users)
        assert.isArray(data.problems.unsolved)
        assert.isArray(data.problems.archived)
        assert.isArray(data.problems.thisWeek)
    })

    it("fail read", () => {
        const data = new Data(nonRepositoryDir);
        assert.throws(() => data.read(), ErrorReadFile);
    })

    it("success write", () => {
        const data = new Data(repositoryDir);
        data.users = {
            laggu: {
                unsolved: [1,2,3],
            },
        };
        data.problems = {
            unsolved: [11,12,13],
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
                unsolved: [1,2,3],
            },
        };
        data.problems = {
            unsolved: [11,12,13],
            archived: [21,22,23],
            thisWeek: [31,32,33],
        }
        assert.throws(() => data.write(), ErrorWriteFile);
    })

    it("success change user name", () => {
        const before = faker.name.firstName();
        const after = faker.name.firstName();

        const data = new Data(nonRepositoryDir);
        data.users = {};
        data.users[before] = {
            unsolved: [1,2,3],
        },

        data.changeUserName(before, after);
        assert.isUndefined(data.users[before]);
        assert.isObject(data.users[after]);
    })

    it("fail change user name with same user id as before", () => {
        const userID = faker.name.firstName();

        const data = new Data(nonRepositoryDir);
        assert.throws(()=>data.changeUserName(userID, userID), ErrorSameUserIDAsBefore);
    })

    it("fail change user name with exist user id", () => {
        const before = faker.name.firstName();
        const after = faker.name.firstName();

        const data = new Data(nonRepositoryDir);
        data.users = {};
        data.users[before] = {
            unsolved: [1,2,3],
        },
        data.users[after] = {
            unsolved: [1,2,3],
        },

        assert.throws(()=>data.changeUserName(before, after), ErrorExistUserID);
    })
})
