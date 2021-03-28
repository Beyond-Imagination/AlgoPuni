import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon, { stub } from 'sinon';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {createRepository} from '../../../src/utils/files/repository';
import {ErrorNoProblemsUnsolvedCheck, ErrorUserUnsolvedCheck, ErrorProblemUnpassed} from '../../../src/utils/error';
import log from '../../../src/utils/log';
import Context from '../../../src/lib/context';
import archive from'../../../src/commands/problem/archive';
import {INFOJSON} from '../../../src/params';
import Executor from '../../../src/lib/executor';
import Problem from '../../../src/lib/problem';
import { writeJSON } from '../../../src/utils/files/json';

const repositoryDir = path.resolve("/","commands","problem","archive","repo");
const repositoryDir1 = path.resolve("/","commands","problem","archive","repo1");
const repositoryDir2 = path.resolve("/","commands","problem","archive","repo2");
const repositoryDir3 = path.resolve("/","commands","problem","archive","repo3");

const assert = chai.assert;

const problemNumber = faker.random.number(10000);
const unsolved = faker.random.number(10000);
const unsolved1 = faker.random.number(10000);
const archived = faker.random.number(10000);
const userID = faker.name.firstName();
const unsolvedSolutionPath = path.resolve(repositoryDir, "problems", `${unsolved}`)
const archivedSolutionPath = path.resolve(repositoryDir, "problems", "archived")
const unsolvedSolutionPath11 = path.resolve(repositoryDir1, "problems", `${unsolved}`)
const unsolvedSolutionPath12 = path.resolve(repositoryDir1, "problems", `${unsolved1}`)
const archivedSolutionPath1 = path.resolve(repositoryDir1, "problems", "archived")


describe("command problem archive", ()=>{
    before(()=>{
        vol.mkdirSync(repositoryDir, {recursive: true});
        vol.mkdirSync(repositoryDir1, {recursive: true});
        vol.mkdirSync(repositoryDir2, {recursive: true});
        vol.mkdirSync(repositoryDir3, {recursive: true});
        vol.mkdirSync(unsolvedSolutionPath, {recursive: true});
        vol.mkdirSync(unsolvedSolutionPath11, {recursive: true});
        vol.mkdirSync(unsolvedSolutionPath12, {recursive: true});
        vol.mkdirSync(archivedSolutionPath, {recursive: true});
        vol.mkdirSync(archivedSolutionPath1, {recursive: true});
        
        fs.writeFileSync(path.resolve(unsolvedSolutionPath, `${userID}.js`), faker.lorem.paragraph());
        fs.writeFileSync(path.resolve(unsolvedSolutionPath11, `${userID}.js`), faker.lorem.paragraph());
        fs.writeFileSync(path.resolve(unsolvedSolutionPath12, `${userID}.js`), faker.lorem.paragraph());
        
        patchFs(vol);

        const jsonContent = {title : faker.lorem.paragraph(),url:faker.internet.url()};
        writeJSON(path.resolve(unsolvedSolutionPath,INFOJSON),jsonContent);
        writeJSON(path.resolve(unsolvedSolutionPath11,INFOJSON),jsonContent);
        writeJSON(path.resolve(unsolvedSolutionPath12,INFOJSON),jsonContent);
        
        createRepository(repositoryDir);
        let context = new Context(repositoryDir);
        context.user.userID = userID;
        context.data.addUser(context.user);
        context.data.users[userID].unsolved = [problemNumber];
        context.data.problems.unsolved = [unsolved,unsolved1];
        context.data.problems.archived = [archived];
        context.write();

        createRepository(repositoryDir1);
        context = new Context(repositoryDir1);
        context.user.userID = userID;
        context.data.addUser(context.user);
        context.data.users[userID].unsolved = [problemNumber];
        context.data.problems.unsolved = [unsolved,unsolved1];
        context.data.problems.archived = [archived];
        context.write();

        createRepository(repositoryDir2);
        context = new Context(repositoryDir2);
        context.user.userID = userID;
        context.data.addUser(context.user);
        context.data.users[userID].unsolved = [problemNumber];
        context.data.problems.unsolved = [problemNumber];
        context.data.problems.archived = [archived];
        context.write();

        createRepository(repositoryDir3);
        context = new Context(repositoryDir3);
        context.user.userID = userID;
        context.data.addUser(context.user);
        context.data.users[userID].unsolved = [unsolved];
        context.data.problems.unsolved = [unsolved,unsolved1];
        context.data.problems.archived = [archived];
        context.write();
    });
    
    const needRestore = []
    afterEach(() => {
        while(needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    });

    it("fail archive the number is not in data.problems.unsolved", async()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir2);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');

        needRestore.push(cwdStub, exitStub, logSpy);

        await archive.parseAsync(['node', 'test', unsolved]);

        assert.isTrue(logSpy.calledOnceWith(ErrorNoProblemsUnsolvedCheck.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorNoProblemsUnsolvedCheck.code));
    });

    it("fail archive some of the numbers are not in data.problems.unsolved", async()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir2);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');

        needRestore.push(cwdStub, exitStub, logSpy);

        await archive.parseAsync(['node', 'test', unsolved, problemNumber]);

        assert.isTrue(logSpy.calledOnceWith(ErrorNoProblemsUnsolvedCheck.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorNoProblemsUnsolvedCheck.code));
    });

    it("fail archive all of the numbers are not in data.problems.unsolved", async()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir2);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');

        needRestore.push(cwdStub, exitStub, logSpy);

        await archive.parseAsync(['node', 'test', unsolved, unsolved1]);

        assert.isTrue(logSpy.calledOnceWith(ErrorNoProblemsUnsolvedCheck.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorNoProblemsUnsolvedCheck.code));
    });

    it("fail archive the number is in data.users.unsolved", async()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir3);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');

        context = new Context()
        context.read();

        needRestore.push(cwdStub, exitStub, logSpy);

        await archive.parseAsync(['node', 'test', unsolved]);

        assert.isTrue(logSpy.calledOnceWith(ErrorUserUnsolvedCheck.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorUserUnsolvedCheck.code));
    });

    it("fail archive some of the numbers are in data.users.unsolved", async()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir3);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');

        context = new Context()
        context.read();

        needRestore.push(cwdStub, exitStub, logSpy);

        await archive.parseAsync(['node', 'test', unsolved, problemNumber]);

        assert.isTrue(logSpy.calledOnceWith(ErrorUserUnsolvedCheck.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorUserUnsolvedCheck.code));
    });

    it("fail archive all of the numbers are in data.users.unsolved", async()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir3);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');

        context = new Context()
        context.read();

        needRestore.push(cwdStub, exitStub, logSpy);

        await archive.parseAsync(['node', 'test', unsolved, unsolved1]);

        assert.isTrue(logSpy.calledOnceWith(ErrorUserUnsolvedCheck.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorUserUnsolvedCheck.code));
    });

    it("fail because the members didn't pass the test ", async() =>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        const execStub = sinon.stub(Executor.prototype,'exec').returns(false);

        needRestore.push(cwdStub, exitStub, logSpy, execStub);

        await archive.parseAsync(['node', 'test', unsolved]);

        assert.isTrue(logSpy.calledOnceWith(ErrorProblemUnpassed.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorProblemUnpassed.code));
    });

    it("sucess archive with One Problem", async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.stub(log, 'error');
        const execStub = sinon.stub(Executor.prototype,'exec').returns(true);
        const archivedInfoSpy = sinon.spy(Date.prototype,'toLocaleString');
        const saveProblemInfoSpy = sinon.spy(Problem.prototype,'saveProblemInfo');
        needRestore.push(cwdStub, exitStub, logSpy, execStub, archivedInfoSpy, saveProblemInfoSpy);
        
        assert.isTrue(fs.existsSync(unsolvedSolutionPath));
        assert.isTrue(fs.existsSync(path.resolve(unsolvedSolutionPath, `${userID}.js`)));
        assert.isTrue(fs.existsSync(path.resolve(unsolvedSolutionPath, INFOJSON)));
        assert.isFalse(fs.existsSync(path.resolve(archivedSolutionPath, `${unsolved}`)));
        
        await archive.parseAsync(['node', 'test', unsolved]);

        const context = new Context(repositoryDir);
        context.read();
            
        assert.isFalse(fs.existsSync(unsolvedSolutionPath));
        assert.isTrue(fs.existsSync(path.resolve(archivedSolutionPath, `${unsolved}`, `${userID}.js`)));
        assert.isTrue(fs.existsSync(path.resolve(archivedSolutionPath, `${unsolved}`, INFOJSON)));
        
        assert.include(context.data.problems.archived,unsolved);
        assert.notInclude(context.data.problems.unsolved,unsolved);
        
        assert.isTrue(archivedInfoSpy.calledOnce);
        assert.isTrue(saveProblemInfoSpy.calledAfter(archivedInfoSpy))
    });

    it("sucess archive with Problems", async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir1);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.stub(log, 'error');
        const execStub = sinon.stub(Executor.prototype,'exec').returns(true);
        const archivedInfoSpy = sinon.spy(Date.prototype,'toLocaleString');
        const saveProblemInfoSpy = sinon.spy(Problem.prototype,'saveProblemInfo');
        needRestore.push(cwdStub, exitStub, logSpy, execStub, archivedInfoSpy, saveProblemInfoSpy);
        
        assert.isTrue(fs.existsSync(unsolvedSolutionPath11));
        assert.isTrue(fs.existsSync(path.resolve(unsolvedSolutionPath11, `${userID}.js`)));
        assert.isTrue(fs.existsSync(path.resolve(unsolvedSolutionPath11, INFOJSON)));
        assert.isTrue(fs.existsSync(unsolvedSolutionPath12));
        assert.isTrue(fs.existsSync(path.resolve(unsolvedSolutionPath12, `${userID}.js`)));
        assert.isTrue(fs.existsSync(path.resolve(unsolvedSolutionPath12, INFOJSON)));
        assert.isFalse(fs.existsSync(path.resolve(archivedSolutionPath1, `${unsolved}`)));
        assert.isFalse(fs.existsSync(path.resolve(archivedSolutionPath1, `${unsolved1}`)));
        
        await archive.parseAsync(['node', 'test', unsolved,unsolved1]);

        const context = new Context(repositoryDir1);
        context.read();

        assert.isFalse(fs.existsSync(unsolvedSolutionPath11));
        assert.isFalse(fs.existsSync(unsolvedSolutionPath12));
        assert.isTrue(fs.existsSync(path.resolve(archivedSolutionPath1, `${unsolved}`, `${userID}.js`)));
        assert.isTrue(fs.existsSync(path.resolve(archivedSolutionPath1, `${unsolved}`, INFOJSON)));
        assert.isTrue(fs.existsSync(path.resolve(archivedSolutionPath1, `${unsolved1}`, `${userID}.js`)));
        assert.isTrue(fs.existsSync(path.resolve(archivedSolutionPath1, `${unsolved1}`, INFOJSON)));

        assert.include(context.data.problems.archived,unsolved);
        assert.include(context.data.problems.archived,unsolved1);
        assert.notInclude(context.data.problems.unsolved,unsolved);
        assert.notInclude(context.data.problems.unsolved,unsolved1);

        assert.isTrue(archivedInfoSpy.calledTwice);
        assert.isTrue(saveProblemInfoSpy.calledAfter(archivedInfoSpy))
    });
});
