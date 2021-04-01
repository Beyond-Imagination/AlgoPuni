import chai from 'chai';
import path from 'path';
import faker from 'faker';
import sinon from 'sinon';
import {vol, fs} from 'memfs';

import Context from '../../../src/lib/context';
import Problem from '../../../src/lib/problem';
import unarchive from '../../../src/commands/problem/unarchive';
import { patchFs } from 'fs-monkey';
import { createRepository } from '../../../src/utils/files/repository';
import {ARCHIVEDDIR, PROBLEMSDIR, INFOJSON} from '../../../src/params'
import { writeJSON } from '../../../src/utils/files/json';
import { ErrorNoArchivedProblem, ErrorReadFile } from '../../../src/utils/error';

const repositoryDir = path.resolve("/","commands","problem","unarchive","repo");
const repositoryDir1 = path.resolve("/","commands","problem","unarchive","repo1");
const problemsDir = path.resolve(repositoryDir, PROBLEMSDIR);
const archivedProblemsDir = path.resolve(problemsDir, ARCHIVEDDIR);
const problemsDir1 = path.resolve(repositoryDir1, PROBLEMSDIR);
const archivedProblemsDir1 = path.resolve(problemsDir1, ARCHIVEDDIR);

const MAX_NUM = 10;
const ProblemCount = 3;
let unarchivedProblemNumbers = [];
let archivedProblemNumbers = [];

const assert = chai.assert;

describe('command Problem unarchive', ()=>{
    before(()=>{
        const testProblems = new Array();
        let problemCount = ProblemCount;
        for (let idx = 1; idx <= MAX_NUM; ++idx) {
            testProblems.push(idx);
        }
        unarchivedProblemNumbers = faker.random.arrayElements(testProblems, problemCount);
        for(let unarchivedNumber of unarchivedProblemNumbers){
            let idx = testProblems.findIndex(element => element == unarchivedNumber);
            testProblems.splice(idx, 1);
        }
        if(testProblems.length < ProblemCount)
            problemCount = testProblems.length;     
        archivedProblemNumbers = faker.random.arrayElements(testProblems, problemCount);

        vol.mkdirSync(repositoryDir, {recursive : true});
        vol.mkdirSync(repositoryDir1, {recursive : true});
        patchFs(vol);
        createRepository(repositoryDir);
        createRepository(repositoryDir1);

        vol.mkdirSync(problemsDir, {recursive : true});
        vol.mkdirSync(problemsDir1, {recursive : true});
        vol.mkdirSync(archivedProblemsDir, {recursive : true});
        vol.mkdirSync(archivedProblemsDir1, {recursive : true});

        let context = new Context(repositoryDir);
        const date = new Date();
        const jsonContent = {title : faker.lorem.paragraph(),url:faker.internet.url(),archived:date.toLocaleString()};

        for (const Archivednumber of archivedProblemNumbers) {
            context.data.problems.archived.push(Archivednumber);
            const archivedProblem = path.resolve(problemsDir, ARCHIVEDDIR, `${Archivednumber}`);
            vol.mkdirSync(archivedProblem, { recursive: true });
            writeJSON(path.resolve(archivedProblem,INFOJSON),jsonContent);
        }
        context.write();

        context = new Context(repositoryDir1)
        for (const Archivednumber of archivedProblemNumbers) {
            context.data.problems.archived.push(Archivednumber);
            const archivedProblem = path.resolve(problemsDir1, ARCHIVEDDIR, `${Archivednumber}`);
            vol.mkdirSync(archivedProblem, { recursive: true });
            writeJSON(path.resolve(archivedProblem,INFOJSON),jsonContent);
        }
        context.write();
    });

    const needRestore = [];
    const needResetUnarchivedNumbers = [];
    afterEach(()=>{
        while(needRestore.length){
            let obj = needRestore.pop();
            obj.restore();
        }
    });

    it('fail to unarchive with unarchived problem', async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir);
        const exitStub = sinon.stub(process, 'exit')
        needRestore.push(cwdStub, exitStub)

        await unarchive.parseAsync(['node', 'test', unarchivedProblemNumbers[0]]);

        assert.isTrue(exitStub.calledOnceWith(ErrorNoArchivedProblem.code));
    });

    it('fail to unvalid parameter(mix archived, unarchived nums)', async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir);
        const exitStub = sinon.stub(process, 'exit')
        needRestore.push(cwdStub, exitStub)

        let parseArr = ['node', 'test', archivedProblemNumbers[0], unarchivedProblemNumbers[0]];    

        await unarchive.parseAsync(parseArr);
    
        assert.isTrue(exitStub.calledOnceWith(ErrorNoArchivedProblem.code));
    });

    it('success to unarchive', async ()=>{
        const INVALID_INDEX = -1;
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir);
        const exitStub = sinon.stub(process, 'exit')
        const saveProblemInfoSpy = sinon.spy(Problem.prototype,'saveProblemInfo');
        needRestore.push(cwdStub, exitStub,saveProblemInfoSpy)
        archivedProblemNumbers.forEach((element)=>{needResetUnarchivedNumbers.push(element);});

        let parseArr = ['node', 'test'];
        parseArr = parseArr.concat(archivedProblemNumbers);

        await unarchive.parseAsync(parseArr);

        const context = new Context(repositoryDir);
        context.read();

        assert.isFalse(exitStub.calledWith(ErrorNoArchivedProblem.code));
        assert.isFalse(exitStub.calledWith(ErrorReadFile.code));
        for (let testNumber of archivedProblemNumbers) {
            assert.isFalse(fs.existsSync(path.resolve(archivedProblemsDir, `${testNumber}`)));
            assert.isFalse(saveProblemInfoSpy.notCalled);
            assert.isTrue(fs.existsSync(path.resolve(problemsDir, `${testNumber}`)));
            assert.isTrue(context.data.problems.unsolved.indexOf(testNumber) != INVALID_INDEX);
            assert.notInclude(context.data.problems.archived,testNumber);
        }
    });

    it('success to unarchive with duplicated problem numbers', async()=>{
        const INVALID_INDEX = -1;
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir1);
        const exitStub = sinon.stub(process, 'exit');
        const saveProblemInfoSpy = sinon.spy(Problem.prototype,'saveProblemInfo');
        needRestore.push(cwdStub, exitStub,saveProblemInfoSpy)
        archivedProblemNumbers.forEach((element)=>{needResetUnarchivedNumbers.push(element);});

        let parseArr = ['node', 'test'];
        let testArchivedProblemNumbers = [];

        archivedProblemNumbers.forEach((element)=>{
            let count = faker.random.number({min:1, max:3});
            while(count--) {testArchivedProblemNumbers.push(element);};
        });
        testArchivedProblemNumbers.sort(()=>{ return 0.5 - Math.random();});

        parseArr = parseArr.concat(testArchivedProblemNumbers);

        await unarchive.parseAsync(parseArr);

        const context = new Context(repositoryDir1);
        context.read();

        assert.isFalse(exitStub.calledWith(ErrorNoArchivedProblem.code));
        assert.isFalse(exitStub.calledWith(ErrorReadFile.code));
        for (let testNumber of archivedProblemNumbers) {
            assert.isFalse(fs.existsSync(path.resolve(archivedProblemsDir1, `${testNumber}`)));
            assert.isFalse(saveProblemInfoSpy.notCalled);
            assert.isTrue(fs.existsSync(path.resolve(problemsDir1, `${testNumber}`)));
            assert.isTrue(context.data.problems.unsolved.indexOf(testNumber) != INVALID_INDEX);
            assert.notInclude(context.data.problems.archived,testNumber);
        }
    });
});