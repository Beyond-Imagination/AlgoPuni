import path from 'path';
import chai from 'chai';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {DATAJSON, USERJSON} from '../../../src/params';
import {createRepository} from '../../../src/utils/files/repository';
import {User} from '../../../src/utils/data/user';

const repositoryDir = path.resolve("/","utils","data","user","repo");
const nonRepositoryDir = path.resolve("/","utils","data","user","non-repo");

let assert = chai.assert;

describe("user.json", () => {
    before(() => {
        vol.mkdirSync(repositoryDir, {recursive: true})
        vol.mkdirSync(nonRepositoryDir, {recursive: true})
        patchFs(vol);
        createRepository(repositoryDir);
    })

    it("success create", () => {
        const user = new User(repositoryDir);
        user.create();
        assert.isString(user.userID, "user json should include string type of userID")
        assert.equal(user.currentProblem, 0, "user json should include 0 value of currentProblem")
        assert.isArray(user.challenging, "user json should include array type of challenging")
        const isExist = fs.existsSync(path.resolve(repositoryDir, USERJSON))
        assert.isTrue(isExist, "fail to create user json")
    })

    it("fail create", () => {
        const user = new User(nonRepositoryDir)
        assert.throws(() => user.create(), `ENOENT: no such file or directory, open '/utils/data/user/non-repo/.algopuni/user.json'`);
    })

    it("success read", () => {
        const user = new User(repositoryDir)
        user.read();
        assert.isString(user.userID, "user json should include string type of userID")
        assert.isNumber(user.currentProblem, "user json should include number type of currentProblem")
        assert.isArray(user.challenging, "user json should include array type of challenging")
    })

    it("fail read", () => {
        const user = new User(nonRepositoryDir)
        assert.throws(() => user.read(), `ENOENT: no such file or directory, open '/utils/data/user/non-repo/.algopuni/user.json'`)
    })

    it("success write", () => {
        const user = new User(repositoryDir);
        user.userID = 'laggu';
        user.currentProblem = 1;
        user.challenging = [1,2,3]
        user.write();
        const result = JSON.parse(fs.readFileSync(path.resolve(repositoryDir, USERJSON)))
        delete user.repository
        assert.deepEqual(result, user)
    })

    it("fail write", () => {
        const user = new User(nonRepositoryDir);
        user.user_id = 'laggu';
        user.current_problem = 1;
        user.challenging = [1,2,3]
        assert.throws(() => user.write(), `ENOENT: no such file or directory, open '/utils/data/user/non-repo/.algopuni/user.json'`)
    })
})
