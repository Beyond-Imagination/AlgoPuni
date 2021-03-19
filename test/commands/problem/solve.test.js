import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import { vol, fs } from 'memfs';
import { patchFs } from 'fs-monkey';

import { createRepository } from '../../../src/utils/files/repository';
import { ErrorTestCaseFail, ErrorNoSelectedProblem, ErrorExecuteSolution } from '../../../src/utils/error';
import log from '../../../src/utils/log';
import Context from '../../../src/lib/context';
import Executor from '../../../src/lib/executor';
import solve from '../../../src/commands/problem/solve';

const repositoryDir1 = path.resolve("/", "commands", "problem", "solve", "repo1");
const repositoryDir2 = path.resolve("/", "commands", "problem", "solve", "repo2");

const unsolved1 = faker.random.number();
const unsolved2 = faker.random.number();
const userID1 = faker.name.firstName();

const assert = chai.assert;

describe("command problem solve", () => {
    before(() => {
        vol.mkdirSync(repositoryDir1, { recursive: true });
        vol.mkdirSync(repositoryDir2, { recursive: true });
        patchFs(vol);

        createRepository(repositoryDir1);
        context = new Context(repositoryDir1);
        context.user.userID = userID1;
        context.user.challenging = unsolved1;
        context.data.addUser(context.user);
        context.data.users[userID1].unsolved = [unsolved1, unsolved2];
        context.write();

        createRepository(repositoryDir2);
        context = new Context(repositoryDir2);
        context.user.userID = userID1;
        context.user.challenging = 0;
        context.data.addUser(context.user);
        context.data.users[userID1].unsolved = [unsolved2];
        context.write();

    });

    const needRestore = []
    afterEach(() => {
        while (needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    });

    it("fail solve by unselected problem", async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir2);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');

        needRestore.push(cwdStub, exitStub, logSpy);

        await solve.parseAsync(['node', 'test']);

        assert.isTrue(logSpy.calledOnceWith(ErrorNoSelectedProblem.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorNoSelectedProblem.code));
    });

    it("fail solve by test case false", async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir1);
        const execStub = sinon.stub(Executor.prototype, 'exec').returns(false);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error')

        needRestore.push(cwdStub, execStub, exitStub, logSpy);

        await solve.parseAsync(['node', 'test']);

        assert.isTrue(logSpy.calledOnceWith(ErrorTestCaseFail.message));        
        assert.isTrue(exitStub.calledOnceWith(ErrorTestCaseFail.code));
    });

    it("sucess solve", async () => {
        const context = new Context(repositoryDir1);
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir1);
        const execStub = sinon.stub(Executor.prototype, 'exec').returns(true);
        
        needRestore.push(cwdStub, execStub);        

        await solve.parseAsync(['node', 'test']);

        context.read();
        assert.notInclude(context.data.users[userID1].unsolved, unsolved1);
        assert.include(context.data.users[userID1].unsolved, unsolved2);
        assert.isTrue(execStub.calledOnce);
    });
});