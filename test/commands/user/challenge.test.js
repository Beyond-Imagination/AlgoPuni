import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {createRepository} from '../../../src/utils/files/repository';
import {ErrorZeroProblemNumber} from '../../../src/utils/error';
import Problem from '../../../src/lib/problem';
import Context from '../../../src/lib/context';
import challenge from'../../../src/commands/user/challenge';

const repositoryDir = path.resolve("/","commands","user","challenge","repo");
const nonRepositoryDir = path.resolve("/","commands","user","challenge","non-repo");

const currentProblem = faker.random.number();

const assert = chai.assert;

describe("command user challenge", ()=>{
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
        context.user.challenging = problemNumber;
        context.write();
    });
    
    const needRestore = []
    afterEach(() => {
        while(needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    })

    it("success challenge", ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir);
        const problemSpy = sinon.spy(Problem.prototype, "displayInfo");
        needRestore.push(cwdStub, problemSpy)

        challenge.parse(['node', 'test']);
        assert.isTrue(problemSpy.calledOnce);
    });

    it("fail challenge with no selected challeging problem", ()=>{
        const context = new Context(repositoryDir);
        context.read();
        context.user.challenging = 0;
        context.write();

        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir)
        const exitStub = sinon.stub(process, 'exit');
        needRestore.push(cwdStub, exitStub)

        challenge.parse(['node', 'test']);
        assert.isTrue(exitStub.calledOnceWith(ErrorZeroProblemNumber.code));
    });
});
