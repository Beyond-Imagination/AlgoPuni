import path from 'path';
import chai from 'chai';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {DATAJSON, USERJSON} from '../../../params';
import {createRepository} from '../../../utils/files/repository';
import {createUserJSON, readUserJSON, writeUserJSON} from '../../../utils/data/user';

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
        let result = createUserJSON(repositoryDir);
        assert.isString(result.user_id, "user json should include string type of user_id")
        assert.equal(result.current_problem, 0, "user json should include 0 value of current_problem")
        assert.isArray(result.challenging, "user json should include array type of challenging")
        const isExist = fs.existsSync(path.resolve(repositoryDir, USERJSON))
        assert.isTrue(isExist, "fail to create user json")
    })

    it("fail create", () => {
        assert.throws(() => createUserJSON(), "no AlgoPuni repository found", "should fail finding repository");
    })

    it("success read", () => {
        const user = readUserJSON(repositoryDir);
    })

    it("fail read", () => {
        assert.throws(() => readUserJSON(nonRepositoryDir), `ENOENT: no such file or directory, open '/utils/data/user/non-repo/.algopuni/user.json'`)
    })

    it("success write", () => {
        const user = {
            user_id: 'laggu',
            current_problem: 1,
            challenging: [1,2,3],
        }
        writeUserJSON(user, repositoryDir);
        const result = JSON.parse(fs.readFileSync(path.resolve(repositoryDir, USERJSON)))
        assert.deepEqual(result, user)
    })

    it("fail write", () => {
        const user = {
            user_id: 'laggu',
            current_problem: 1,
            challenging: [1,2,3],
        }
        assert.throws(() => writeUserJSON(user, nonRepositoryDir), `ENOENT: no such file or directory, open '/utils/data/user/non-repo/.algopuni/user.json'`)
    })
})
