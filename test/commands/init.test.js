import path from 'path';
import chai from 'chai';
import sinon from 'sinon'
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {DATAJSON, USERJSON} from '../../src/params';
import {createRepository} from '../../src/utils/files/repository';
import * as repository from '../../src/utils/files/repository';
import {User} from '../../src/lib/context/user';
import init from'../../src/commands/init';

let assert = chai.assert;

const repositoryDir = path.resolve("commands", "init", "repo");
const nonRepositoryDir = path.resolve("commands", "init", "non-repo");

describe("command init", () => {
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

    it("success init", async () => {
        const userStub = sinon.stub(User.prototype, 'askUserID').returns("user")
        needRestore.push(userStub)
        const cwd = sinon.stub(process, 'cwd').returns(nonRepositoryDir)
        needRestore.push(cwd)

        await init.parseAsync(['node', 'test']);

        const user = JSON.parse(fs.readFileSync(path.resolve(nonRepositoryDir, USERJSON)))
        assert.isString(user.userID)
        assert.isNumber(user.currentProblem)

        const data = JSON.parse(fs.readFileSync(path.resolve(nonRepositoryDir, DATAJSON)))
        assert.isObject(data.users);
        assert.isArray(data.problems.challenging);
        assert.isArray(data.problems.archived);
        assert.isArray(data.problems.thisWeek);
        assert.deepEqual(data.users[user.userID].challenging, data.problems.challenging);
    })

    it("fail init", async () => {
        const spy = sinon.spy(repository, "createRepository");
        const cwd = sinon.stub(process, 'cwd').returns(repositoryDir)
        needRestore.push(spy, cwd)

        await init.parseAsync(['node', 'test']);

        assert.isTrue(spy.calledOnce);
        assert.isTrue(spy.threw());
    })
})
