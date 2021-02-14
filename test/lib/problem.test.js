import path from 'path';
import chai from 'chai';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';
import faker from 'faker';

import {PROBLEMDIR, INFOJSON, TESTCASESJSON, PROBLEMJS} from '../../src/params';
import {createRepository} from '../../src/utils/files/repository';
import Problem from '../../src/lib/problem';
import {solutionString, casesString, infoString} from './sample.code';

const userID = faker.name.firstName();
const currentProblem = faker.random.number();

const repositoryDir = path.resolve("/","lib","problem","repo");
const nonRepositoryDir = path.resolve("/","lib","problem","non-repo");
const problemDir = path.resolve(repositoryDir, PROBLEMDIR, `${currentProblem}`);

let assert = chai.assert;

describe("problem", () => {
    before(() => {
        vol.mkdirSync(repositoryDir, {recursive: true})
        vol.mkdirSync(nonRepositoryDir, {recursive: true})
        vol.mkdirSync(problemDir, {recursive: true})
        patchFs(vol);
        fs.writeFileSync(path.resolve(problemDir, PROBLEMJS), solutionString)
        fs.writeFileSync(path.resolve(problemDir, TESTCASESJSON), casesString)
        fs.writeFileSync(path.resolve(problemDir, INFOJSON), infoString)
        createRepository(repositoryDir)
    })

    // it("save problem", () => {
        
    // })

    it("get info", () => {
        const problem = new Problem(repositoryDir, currentProblem);
        const info = problem.getInfo();
        const expected = JSON.parse(infoString);
        assert.deepEqual(info, expected);
    })

    it("get test cases", () => {
        console.log(TESTCASESJSON);
        const problem = new Problem(repositoryDir, currentProblem);
        const testCases = problem.getTestCases();
        const expected = JSON.parse(casesString);
        assert.deepEqual(testCases, expected);
    })

    it("create user solution", () => {
        const problem = new Problem(repositoryDir, currentProblem);
        problem.createUserSolution(userID);
        const userSolution = fs.readFileSync(path.resolve(problemDir, `${userID}.js`))
        assert.deepEqual(userSolution.toString(), solutionString);
    })

    it("get user solution path", () => {
        const problem = new Problem(repositoryDir, currentProblem);
        const userSolutionPath = problem.getUserSolutionPath(userID);
        assert.equal(userSolutionPath, path.resolve(problemDir, `${userID}.js`))
    })
})
