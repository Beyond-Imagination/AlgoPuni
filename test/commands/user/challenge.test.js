import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {createRepository} from '../../../src/utils/files/repository'
import Problem from '../../../src/lib/problem'
import Context from '../../../src/lib/context'
import challenge from'../../../src/commands/user/challenge'

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

        // Save Temp Data.
        const problem = new Problem(repositoryDir, 0);
        problem.saveProblem(problemInfo);

        const context = new Context(repositoryDir);
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
        const cwd = sinon.stub(process, 'cwd').returns(repositoryDir)
        needRestore.push(cwd)
        const spy = sinon.spy(Problem.prototype, "displayInfo");
        needRestore.push(spy)

        challenge.parse(['node', 'test', 'user', 'challenge']);
        assert.isTrue(spy.calledOnce);
    });
});