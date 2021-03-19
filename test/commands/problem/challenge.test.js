import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import { vol, fs } from 'memfs';
import { patchFs } from 'fs-monkey';

import { createRepository } from '../../../src/utils/files/repository';
import { ErrorExistProblemDir } from '../../../src/utils/error';
import Context from '../../../src/lib/context';
import Problem from '../../../src/lib/problem';
import challenge from '../../../src/commands/problem/challenge';
import log from '../../../src/utils/log';

const repositoryDir1 = path.resolve("/", "commands", "problem", "challenge", "repo1");

const assert = chai.assert;

describe("command problem exec", () => {
    before(() => {
        vol.mkdirSync(repositoryDir1, { recursive: true });
        patchFs(vol);

        createRepository(repositoryDir1);
        let context = new Context(repositoryDir1);
        context.user.userID = faker.name.firstName();
        context.user.challenging = faker.random.number();
        context.write();
    });

    const needRestore = []
    afterEach(() => {
        while (needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    })

    it("sucess challenge without user solution", () => {
        const problemNumber = faker.random.number();

        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir1);
        const isProblemExistStub = sinon.stub(Problem.prototype, 'isProblemExist').returns(true);
        const isUserSolutionExistStub = sinon.stub(Problem.prototype, 'isUserSolutionExist').returns(false);
        const iscreateUserSolutionStub = sinon.stub(Problem.prototype, 'createUserSolution');

        needRestore.push(cwdStub, isProblemExistStub, isUserSolutionExistStub, iscreateUserSolutionStub);

        challenge.parseAsync(['node', 'test', problemNumber]);

        const context = new Context(repositoryDir1);

        context.read();

        assert.equal(context.user.challenging, problemNumber);
        assert.isTrue(iscreateUserSolutionStub.calledOnceWith(context.user.userID));
    });


    it("sucess challenge with user solution", () => {
        const problemNumber = faker.random.number();

        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir1);
        const isProblemExistStub = sinon.stub(Problem.prototype, 'isProblemExist').returns(true);
        const isUserSolutionExistStub = sinon.stub(Problem.prototype, 'isUserSolutionExist').returns(true);
        const iscreateUserSolutionStub = sinon.stub(Problem.prototype, 'createUserSolution');

        needRestore.push(cwdStub, isProblemExistStub, isUserSolutionExistStub, iscreateUserSolutionStub);

        challenge.parseAsync(['node', 'test', problemNumber]);

        const context = new Context(repositoryDir1);

        context.read();

        assert.equal(context.user.challenging, problemNumber);
        assert.isTrue(iscreateUserSolutionStub.notCalled);
    });


    it("fail challenge problem does not exist", () => {
        const problemNumber = faker.random.number();

        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir1);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        const isProblemExistStub = sinon.stub(Problem.prototype, 'isProblemExist').returns(false);

        needRestore.push(cwdStub, exitStub, isProblemExistStub, logSpy);

        challenge.parseAsync(['node', 'test', problemNumber]);

        assert.isTrue(logSpy.calledOnceWith(ErrorExistProblemDir.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorExistProblemDir.code));
    });

});
