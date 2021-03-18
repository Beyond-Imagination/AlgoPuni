import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon, { stub } from 'sinon';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {createRepository} from '../../../src/utils/files/repository';
import {ErrorNoProgrammersAccount,ErrorFailCrawlProblem,ErrorExistProblemNumber} from '../../../src/utils/error';
import log from '../../../src/utils/log';
import Context from '../../../src/lib/context';
import add from'../../../src/commands/problem/add';
import {PROBLEMSDIR, PROBLEMJS, PROBLEMMD, INFOJSON, TESTCASESJSON} from '../../../src/params';
import Crawler from '../../../src/lib/crawler';

const repositoryDir0 = path.resolve("/","commands","problem","add","repo0");
const repositoryDir1 = path.resolve("/","commands","problem","add","repo1");
const repositoryDir2 = path.resolve("/","commands","problem","add","repo2");

const assert = chai.assert;

let problemNumber,problemNumber1,problemNumber2,problemNumber3;
problemNumber = faker.random.number(10000);
problemNumber1 = faker.random.number(10000);
problemNumber2 = faker.random.number(10000);
problemNumber3 = faker.random.number(10000);

describe("command problem add", ()=>{
    before(()=>{
        vol.mkdirSync(repositoryDir0, {recursive: true});
        vol.mkdirSync(repositoryDir1, {recursive: true});
        vol.mkdirSync(repositoryDir2, {recursive: true});
        
        patchFs(vol);

        createRepository(repositoryDir0);
        let context = new Context(repositoryDir0);
        let userID = faker.name.firstName();
        context.user.userID = userID;
        context.data.addUser(context.user);
        context.data.users[userID].unsolved = [problemNumber1];
        context.data.problems.unsolved = [problemNumber2];
        context.write();

        createRepository(repositoryDir1);
        context = new Context(repositoryDir1);
        userID = faker.name.firstName();
        context.user.userID = userID;
        context.data.addUser(context.user);
        context.data.users[userID].unsolved = [problemNumber1];
        context.data.problems.unsolved = [problemNumber2];
        context.data.problems.archived = [problemNumber3];
        context.user.programmers.email = faker.internet.email();
        context.user.programmers.password = faker.internet.password();
        context.write();

        createRepository(repositoryDir2);
        context = new Context(repositoryDir2);
        userID = faker.name.firstName();
        context.user.userID = userID;
        context.data.addUser(context.user);
        context.data.users[userID].unsolved = [problemNumber1,problemNumber2];
        context.data.problems.unsolved = [problemNumber1,problemNumber2];
        context.user.programmers.email = faker.internet.email();
        context.user.programmers.password = faker.internet.password();
        context.write();
    });
    
    const needRestore = []
    afterEach(() => {
        while(needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    })

    it("fail get login info", async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir0);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        needRestore.push(cwdStub, exitStub, logSpy);

        await add.parseAsync(['node', 'test', problemNumber]);

        assert.isTrue(logSpy.calledOnceWith(ErrorNoProgrammersAccount.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorNoProgrammersAccount.code));
    });

    it("fail crawl", async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir1);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        const crawlStub = sinon.stub(Crawler.prototype,'crawl').throws(ErrorFailCrawlProblem);
        needRestore.push(cwdStub, exitStub, logSpy, crawlStub);

        await add.parseAsync(['node', 'test', problemNumber]);

        assert.isTrue(logSpy.calledOnceWith(ErrorFailCrawlProblem.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorFailCrawlProblem.code));
    });

    it("fail add by existed problemNumber in data.problems.unsolved", async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir1);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        needRestore.push(cwdStub, exitStub, logSpy);
        
        await add.parseAsync(['node', 'test', problemNumber2]);

        assert.isTrue(logSpy.calledOnceWith(ErrorExistProblemNumber.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorExistProblemNumber.code));
    });

    it("fail add by existed problemNumber in data.problems.archived", async ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir1);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        needRestore.push(cwdStub, exitStub, logSpy);
        
        await add.parseAsync(['node', 'test', problemNumber3]);

        assert.isTrue(logSpy.calledOnceWith(ErrorExistProblemNumber.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorExistProblemNumber.code));
    });

    it("sucess add", async ()=>{
        
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir2);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        const caseLength = faker.random.number(5);
        const problemInfo = {
            description: faker.lorem.paragraphs(),
            code: faker.lorem.paragraph(),
            testCases: {
                inputs: Array.from(Array(caseLength), () => faker.random.number(10000)),
                outputs: Array.from(Array(caseLength), () => faker.random.number(10000)),
            },
            info: {
                title: faker.lorem.words(),
                url: faker.internet.url(),
            }
        }
        const crawlStub = sinon.stub(Crawler.prototype,'crawl').returns(problemInfo);

        needRestore.push(cwdStub, exitStub, logSpy, crawlStub);
        
        await add.parseAsync(['node', 'test', problemNumber]);

        const context = new Context(repositoryDir2);
        context.read();
        
        ///1. context.data.users.unsolved 추가
        for(const [userID,userInfo] of Object.entries(context.data.users)){
            assert.include(userInfo.unsolved,problemNumber);
        }
        ///2. context.data.problems.unsolved 추가        
        assert.include(context.data.problems.unsolved,problemNumber);
        /// 3. file 생성 체크
        const problemDir = path.resolve(repositoryDir2, PROBLEMSDIR, `${problemNumber}`);
        assert.deepEqual(fs.readFileSync(path.resolve(problemDir, PROBLEMJS)).toString(), problemInfo.code);
        assert.deepEqual(JSON.parse(fs.readFileSync(path.resolve(problemDir, TESTCASESJSON)).toString()), problemInfo.testCases);
        assert.deepEqual(JSON.parse(fs.readFileSync(path.resolve(problemDir, INFOJSON)).toString()), problemInfo.info);
        assert.deepEqual(fs.readFileSync(path.resolve(problemDir, PROBLEMMD)).toString(), problemInfo.description);
    });
});
