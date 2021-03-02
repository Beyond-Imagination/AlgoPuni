import path from 'path';
import chai from 'chai';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';
import faker from 'faker';
import sinon from 'sinon';

import {PROBLEMSDIR, TESTCASESJSON} from '../../src/params';
import {createRepository} from '../../src/utils/files/repository';
import {ErrorNoUserSolution, ErrorExecuteSolution} from '../../src/utils/error';
import Executor from '../../src/lib/executor';
import Context from '../../src/lib/context';
import {solutionString, casesString} from './sample.string'

const userID = faker.name.firstName();
const challenging = faker.random.number();

const repositoryDir = path.resolve("/","lib","exec","repo");
const nonRepositoryDir = path.resolve("/","lib","exec","non-repo");
const problemDir = path.resolve(repositoryDir, PROBLEMSDIR, `${challenging}`);

const context = new Context(repositoryDir);
context.user.userID = userID;
context.user.challenging = challenging;

let assert = chai.assert;

describe("executor", () => {
    before(() => {
        vol.mkdirSync(repositoryDir, {recursive: true})
        vol.mkdirSync(nonRepositoryDir, {recursive: true})
        vol.mkdirSync(problemDir, {recursive: true})
        vol.mkdirSync(__dirname, {recursive: true})
        patchFs(vol);

        fs.writeFileSync(path.resolve(problemDir, TESTCASESJSON), casesString)
        fs.writeFileSync(path.resolve(__dirname, "./sample.solution.js"), solutionString)
        createRepository(repositoryDir)
    })
    
    const needRestore = []
    afterEach(() => {
        while(needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    })

    it("get solution", async () => {
        const executor = new Executor(context);
        const problemStub = sinon.stub(executor.problem, "getUserSolutionPath").returns(path.resolve(__dirname, "./sample.solution.js"));
        needRestore.push(problemStub)

        const solution = await executor.getSolution();
        assert.isFunction(solution);
    })

    it("success marking", () => {
        const executor = new Executor(context);
        const testCases = executor.problem.getTestCases();
        const solution = (x,y) => x+y;
        let result = executor.marking(solution, testCases);
        assert.isTrue(result);
    })

    it("fail marking", () => {
        const executor = new Executor(context);
        const testCases = executor.problem.getTestCases();
        const solution = (x,y) => x-y;
        let result = executor.marking(solution, testCases);
        assert.isFalse(result);
    })

    it("exec test", async () => {
        const executor = new Executor(context);
        const problemStub = sinon.stub(executor.problem, "getUserSolutionPath").returns(path.resolve(__dirname, "./sample.solution.js"));
        needRestore.push(problemStub)

        const result = await executor.exec();
        assert.isTrue(result);
    })

    it("fail exec test without user solution", async () => {
        const executor = new Executor(context);
        
        try {
            const result = await executor.exec();
            assert.fail();
        } catch (error) {
            assert.deepEqual(error, ErrorNoUserSolution);
        }
    })

    it("fail exec test with invalid user solution", async () => {
        const executor = new Executor(context);
        const pathStub = sinon.stub(executor.problem, "isUserSolutionExist").returns(true)
        const problemStub = sinon.stub(executor.problem, "getUserSolutionPath").returns(path.resolve(__dirname, "./inavlid_solution.js"));
        needRestore.push(pathStub, problemStub)
        
        try {
            const result = await executor.exec();
            assert.fail();
        } catch (error) {
            assert.deepEqual(error, ErrorNoUserSolution);
        }
    })
})
