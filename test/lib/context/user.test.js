import path from 'path';
import chai from 'chai';
import sinon from 'sinon';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {DATAJSON, USERJSON} from '../../../src/params';
import {createRepository} from '../../../src/utils/files/repository';
import {User} from '../../../src/lib/context/user';

const repositoryDir = path.resolve("/","lib","context","user","repo");
const nonRepositoryDir = path.resolve("/","lib","context","user","non-repo");

let assert = chai.assert;

describe("user.json", () => {
    const needRestore = []

    before(() => {
        vol.mkdirSync(repositoryDir, {recursive: true})
        vol.mkdirSync(nonRepositoryDir, {recursive: true})
        patchFs(vol);
        createRepository(repositoryDir);
    })

    afterEach(() => {
        while(needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    })

    it("success create", async () => {
        const user = new User(repositoryDir);
        const userStub = sinon.stub(user, 'askUserID').returns("user")
        needRestore.push(userStub)

        await user.create();
        assert.equal(repositoryDir, user.repository)
        assert.equal(path.resolve(repositoryDir, USERJSON), user.path)
        assert.isString(user.userID, "user json should include string type of userID")
        assert.equal(user.currentProblem, 0, "user json should include 0 value of currentProblem")
        const isExist = fs.existsSync(path.resolve(repositoryDir, USERJSON))
        assert.isTrue(isExist, "fail to create user json")
    })

    it("fail create", async () => {
        const user = new User(nonRepositoryDir)
        const userStub = sinon.stub(user, 'askUserID').returns("user")
        needRestore.push(userStub)

        user.create()
            .then(()=>{
                throw new Error("test fail")
            })
            .catch((err)=>{
                // test success. should throw err
            })
    })

    it("success read", () => {
        const user = new User(repositoryDir)
        user.read();
        assert.isString(user.userID, "user json should include string type of userID")
        assert.isNumber(user.currentProblem, "user json should include number type of currentProblem")
    })

    it("fail read", () => {
        const user = new User(nonRepositoryDir)
        assert.throws(() => user.read())
    })

    it("success write", () => {
        const user = new User(repositoryDir);
        user.userID = 'laggu';
        user.currentProblem = 1;
        user.challenging = [1,2,3]
        user.write();
        const result = JSON.parse(fs.readFileSync(path.resolve(repositoryDir, USERJSON)))
        assert.deepEqual(result, user.toJSON())
    })

    it("fail write", () => {
        const user = new User(nonRepositoryDir);
        user.user_id = 'laggu';
        user.current_problem = 1;
        user.challenging = [1,2,3]
        assert.throws(() => user.write())
    })
})
