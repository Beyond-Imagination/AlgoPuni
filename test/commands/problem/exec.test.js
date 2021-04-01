import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import {vol} from 'memfs';
import {patchFs} from 'fs-monkey';

import {createRepository} from '../../../src/utils/files/repository';
import {ErrorNoRepositoryFound, ErrorZeroProblemNumber, ErrorNoUserSolution} from '../../../src/utils/error';
import log from '../../../src/utils/log';
import Context from '../../../src/lib/context';
import Executor from '../../../src/lib/executor';
import exec from'../../../src/commands/problem/exec';

const repositoryDir1 = path.resolve("/","commands","problem","exec","repo1");
const repositoryDir2 = path.resolve("/","commands","problem","exec","repo2");
const nonRepositoryDir = path.resolve("/","commands","problem","exec","non-repo");

const assert = chai.assert;

describe("command problem exec", ()=>{
    before(()=>{
        vol.mkdirSync(repositoryDir1, {recursive: true});
        vol.mkdirSync(repositoryDir2, {recursive: true});
        vol.mkdirSync(nonRepositoryDir, {recursive: true});
        patchFs(vol);

        createRepository(repositoryDir1);
        let context = new Context(repositoryDir1);
        context.user.userID = faker.name.firstName();
        context.user.challenging = 0;
        context.write();

        createRepository(repositoryDir2);
        context = new Context(repositoryDir2);
        context.user.userID = faker.name.firstName();
        context.user.challenging = faker.random.number();
        context.write();
    });
    
    const needRestore = []
    afterEach(() => {
        while(needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    })

    it("fail exec with no repository", async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(nonRepositoryDir);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        needRestore.push(cwdStub, exitStub, logSpy);

        await exec.parseAsync(['node', 'test']);

        assert.isTrue(logSpy.calledOnceWith(ErrorNoRepositoryFound.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorNoRepositoryFound.code));
    });

    it("fail exec by unselected problem", async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir1);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        needRestore.push(cwdStub, exitStub, logSpy);

        await exec.parseAsync(['node', 'test']);

        assert.isTrue(logSpy.calledOnceWith(ErrorZeroProblemNumber.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorZeroProblemNumber.code));
    });

    it("fail exec by execute solution", async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir2);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        needRestore.push(cwdStub, exitStub, logSpy);

        await exec.parseAsync(['node', 'test']);

        assert.isTrue(logSpy.calledOnceWith(ErrorNoUserSolution.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorNoUserSolution.code));
    });

    it("sucess exec", async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir2);
        const exeuctorStub = sinon.stub(Executor.prototype, 'exec').returns(true);
        needRestore.push(cwdStub, exeuctorStub);

        await exec.parseAsync(['node', 'test']);

        assert.isTrue(exeuctorStub.calledOnce);
    });
});
