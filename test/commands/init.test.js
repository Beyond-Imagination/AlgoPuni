import path from 'path';
import chai from 'chai';
import sinon from 'sinon'
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {DATAJSON, USERJSON} from '../../src/params';
import {createRepository} from '../../src/utils/files/repository';
import * as repository from '../../src/utils/files/repository';
import init from'../../src/commands/init'

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

    it("success init", () => {
        const cwd = sinon.stub(process, 'cwd').returns(nonRepositoryDir)
        needRestore.push(cwd)

        init.parse(['node', 'test', 'init']);

        const user = JSON.parse(fs.readFileSync(path.resolve(nonRepositoryDir, USERJSON)))
        assert.isString(user.user_id)
        assert.isNumber(user.current_problem)
        assert.isArray(user.challenging)

        const data = JSON.parse(fs.readFileSync(path.resolve(nonRepositoryDir, DATAJSON)))
        assert.isObject(data.users)
        assert.isArray(data.problems.challenging)
        assert.isArray(data.problems.archived)
        assert.isArray(data.problems.this_week)
        assert.deepEqual(data.users[user.user_id], user)
    })

    it("fail init", () => {
        const spy = sinon.spy(repository, "createRepository");
        const cwd = sinon.stub(process, 'cwd').returns(repositoryDir)
        needRestore.push(spy, cwd)

        init.parse(['node', 'test', 'init']);

        assert.isTrue(spy.calledOnce);
        assert.isTrue(spy.threw());
    })
})
