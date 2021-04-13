import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import { vol, fs } from 'memfs';
import { patchFs } from 'fs-monkey';
import { ErrorNoProblemsUnsolvedCheck } from '../../../src/utils/error';

import { createRepository } from '../../../src/utils/files/repository';
import log from '../../../src/utils/log';
import Context from '../../../src/lib/context';
import set from '../../../src/commands/thisweek/set';

const repositoryDir1 = path.resolve("/", "commands", "thisweek", "set", "repo1");
const repositoryDir2 = path.resolve("/", "commands", "thisweek", "set", "repo2");
const assert = chai.assert;

describe("command thisweek set", () => {
    before(() => {
        log.setLevel('debug');
    });

    const needRestore = []
    afterEach(() => {
        while (needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    });

    it("sucess set", () => {
        const problemnum1 = faker.random.number();
        const problemnum2 = faker.random.number();
        const problemnum3 = faker.random.number();
        const unsolvedNumbers = [problemnum1, problemnum2, problemnum3];
        const problemNumbers = [problemnum1, problemnum2];

        vol.mkdirSync(repositoryDir1, { recursive: true });
        patchFs(vol);

        createRepository(repositoryDir1);
        context = new Context(repositoryDir1);
        context.data.problems.unsolved = unsolvedNumbers;
        context.write();

        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir1);

        needRestore.push(cwdStub);

        set.parseAsync(['node', 'test', ...problemNumbers]);

        context.read();

        assert.deepEqual(problemNumbers, context.data.problems.thisWeek);
    });

    it("fail does not have unsolved problem numbers", () => {
        const problemnum1 = faker.random.number();
        const problemnum2 = faker.random.number();
        const problemnum3 = faker.random.number();
        const unsolvedNumbers = [problemnum1, problemnum2, problemnum3];
        const problemNumbers = [problemnum1, problemnum2];

        vol.mkdirSync(repositoryDir2, { recursive: true });
        patchFs(vol);

        createRepository(repositoryDir2);
        context = new Context(repositoryDir2);
        context.data.problems.unsolved = unsolvedNumbers;
        context.data.problems.thisWeek = problemNumbers;
        context.write();

        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir2);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        const fakeProblemNumbers = [faker.random.number(), faker.random.number()];

        needRestore.push(cwdStub, exitStub, logSpy);

        set.parseAsync(['node', 'test', ...fakeProblemNumbers]);

        assert.isTrue(logSpy.calledWith(ErrorNoProblemsUnsolvedCheck.message));
        assert.isTrue(exitStub.calledWith(ErrorNoProblemsUnsolvedCheck.code));
    });
});