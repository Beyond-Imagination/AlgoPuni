import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {createRepository} from '../../../src/utils/files/repository';
import {ErrorNoSelectedProblem} from '../../../src/utils/error';
import log from '../../../src/utils/log';
import Problem from '../../../src/lib/problem';
import Context from '../../../src/lib/context';
import unsolved from'../../../src/commands/user/unsolved';

const repositoryDir = path.resolve("/","commands","user","unsolved","repo");
const nonRepositoryDir = path.resolve("/","commands","user","unsolved","non-repo");

const challenging = faker.random.number();
const userID = faker.name.firstName();

const assert = chai.assert;
log.setLevel("debug");

describe("command user unsolved", ()=>{
    before(()=>{
        // Make Temporary Repository
        vol.mkdirSync(repositoryDir, {recursive: true});
        patchFs(vol);
        createRepository(repositoryDir);

        // Temp Data
        const problemInfo = {
            description: faker.lorem.paragraphs(),
            code: faker.lorem.paragraph(),
            testCases: {
                inputs: Array.from(Array(1), () => faker.random.number(10000)),
                outputs: Array.from(Array(1), () => faker.random.number(10000)),
            },
            info: {
                title: faker.lorem.words(),
                url: faker.internet.url(),
                // level: 2,
                deadline: "2021-02-21",
                archived: "2021-03-05"
            }
        };

        const problemNumber = faker.random.number(10000);
        // Save Temp Data.
        const problem = new Problem(repositoryDir, problemNumber);
        problem.saveProblem(problemInfo);

        const context = new Context(repositoryDir);
        context.user.userID = userID;
        context.data.addUser(context.user);
        context.data.users[userID].unsolved = [problemNumber];
        context.write();
    });
    
    const needRestore = []
    afterEach(() => {
        while(needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    })

    it("success unsolved when unsolved problem exist", ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir)
        const problemSpy = sinon.spy(Problem.prototype, "displayInfo");
        needRestore.push(cwdStub, problemSpy)

        unsolved.parse(['node', 'test']);
        assert.isTrue(problemSpy.calledOnce);
    });

    it("success unsolved when user solved all problem", ()=>{
        const context = new Context(repositoryDir);
        context.read();
        context.data.users[userID].unsolved = [];
        context.write();
        
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir)
        const logSpy = sinon.spy(log, "info");
        needRestore.push(cwdStub, logSpy)

        unsolved.parse(['node', 'test']);
        assert.isTrue(logSpy.calledOnceWith("모든 문제를 풀었습니다."));
    });
});
