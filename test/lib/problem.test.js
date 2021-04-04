import path from 'path';
import chai from 'chai';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';
import faker from 'faker';

import {PROBLEMSDIR, ARCHIVEDDIR, INFOJSON, TESTCASESJSON, PROBLEMJS, PROBLEMMD} from '../../src/params';
import {createRepository} from '../../src/utils/files/repository';
import {ErrorNoRepositoryFound, ErrorZeroProblemNumber, ErrorExistProblemDir, ErrorNoArchivedProblem} from '../../src/utils/error';
import Problem from '../../src/lib/problem';
import {solutionString, casesString, infoString} from './sample.string';

const userID = faker.name.firstName();
const currentProblem = faker.random.number();

const repositoryDir = path.resolve("/","lib","problems","repo");
const repositoryDir1 = path.resolve("/","lib","problems","repo1");
const nonRepositoryDir = path.resolve("/","lib","problems","non-repo");
const problemDir = path.resolve(repositoryDir, PROBLEMSDIR, `${currentProblem}`);
const problemDir1 = path.resolve(repositoryDir1, PROBLEMSDIR,ARCHIVEDDIR, `${currentProblem}`);

let assert = chai.assert;

describe("problem", () => {
    before(() => {
        vol.mkdirSync(repositoryDir, {recursive: true})
        vol.mkdirSync(nonRepositoryDir, {recursive: true})
        vol.mkdirSync(problemDir, {recursive: true})
        vol.mkdirSync(repositoryDir1, {recursive: true})
        vol.mkdirSync(problemDir1, {recursive: true})

        patchFs(vol);
        fs.writeFileSync(path.resolve(problemDir, PROBLEMJS), solutionString)
        fs.writeFileSync(path.resolve(problemDir, TESTCASESJSON), casesString)
        fs.writeFileSync(path.resolve(problemDir, INFOJSON), infoString)
        createRepository(repositoryDir)

        fs.writeFileSync(path.resolve(problemDir1, PROBLEMJS), solutionString)
        fs.writeFileSync(path.resolve(problemDir1, TESTCASESJSON), casesString)
        fs.writeFileSync(path.resolve(problemDir1, INFOJSON), infoString)
        createRepository(repositoryDir1)
    })

    it("get problem path", () => {
        const problem = new Problem(repositoryDir, currentProblem);
        let problemPath = problem.getProblemPath();
        assert.equal(problemPath, path.resolve(repositoryDir, PROBLEMSDIR, `${currentProblem}`));
        problem.isArchived = true;
        problemPath = problem.getProblemPath();
        assert.equal(problemPath, path.resolve(repositoryDir, PROBLEMSDIR, ARCHIVEDDIR, `${currentProblem}`));
    })

    it("get info", () => {
        const problem = new Problem(repositoryDir, currentProblem);
        const info = problem.getInfo();
        const expected = JSON.parse(infoString);
        assert.deepEqual(info, expected);
    })

    it("get test cases", () => {
        const problem = new Problem(repositoryDir, currentProblem);
        const testCases = problem.getTestCases();
        const expected = JSON.parse(casesString);
        assert.deepEqual(testCases, expected);
    })

    it("get user solution path", () => {
        const problem = new Problem(repositoryDir, currentProblem);
        const userSolutionPath = problem.getUserSolutionPath(userID);
        assert.equal(userSolutionPath, path.resolve(problemDir, `${userID}.js`))
    })

    it("create user solution", () => {
        const problem = new Problem(repositoryDir, currentProblem);
        problem.createUserSolution(userID);
        const userSolution = fs.readFileSync(path.resolve(problemDir, `${userID}.js`))
        assert.deepEqual(userSolution.toString(), solutionString);
    })

    it("is user solution exist", () => {
        const problem = new Problem(repositoryDir, currentProblem);
        assert.isTrue(problem.isUserSolutionExist(userID));
        assert.isFalse(problem.isUserSolutionExist("not exist userID"));
    })

    it("save problem", () => {
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

        const problem = new Problem(repositoryDir, currentProblem);
        problem.saveProblem(problemInfo);
        assert.deepEqual(fs.readFileSync(path.resolve(problemDir, PROBLEMJS)).toString(), problemInfo.code);
        assert.deepEqual(JSON.parse(fs.readFileSync(path.resolve(problemDir, TESTCASESJSON)).toString()), problemInfo.testCases);
        assert.deepEqual(JSON.parse(fs.readFileSync(path.resolve(problemDir, INFOJSON)).toString()), problemInfo.info);
        assert.deepEqual(fs.readFileSync(path.resolve(problemDir, PROBLEMMD)).toString(), problemInfo.description);
    })

    it("fail save prblem", () => {
        const caseLength = faker.random.number(5);
        const problemInfo = {
            description: faker.lorem.paragraphs(),
            code: faker.lorem.paragraph(),
            testCases: {
                inputs: Array.from(Array(caseLength), () => faker.random.number(10000)),
                outputs: Array.from(Array(caseLength), () => faker.random.number(10000)),
            },
        }

        const problem = new Problem(nonRepositoryDir, currentProblem);
        assert.throw(() => problem.saveProblem(problemInfo), ErrorNoRepositoryFound.message)
    })

    it("fail display info", () => {
        const problem = new Problem(nonRepositoryDir, 0);
        assert.throw(() => problem.displayInfo(), ErrorZeroProblemNumber.message);
    })

    it("change user solution name", () => {
        const beforeUserID = faker.name.firstName();
        const afterUserID = faker.name.firstName();
        fs.writeFileSync(path.resolve(problemDir, `${beforeUserID}.js`), solutionString)

        const problem = new Problem(repositoryDir, currentProblem);

        assert.throw(()=>problem.changeUserSolutionName("invalidID", afterUserID));
        
        problem.changeUserSolutionName(beforeUserID, afterUserID);
        assert.isTrue(fs.existsSync(path.resolve(problemDir, `${afterUserID}.js`)));
    })

    it("fail problem existed",() =>{
        const problem = new Problem('', '');
        assert.isFalse(problem.isProblemExist());
    })

    it("fail archived problem existed",() =>{
        const problem = new Problem('', '',true);
        assert.isFalse(problem.isProblemExist());
    })
    
    it("check problem existed", () =>{
        const problem = new Problem(repositoryDir, currentProblem);
        assert.isTrue(problem.isProblemExist());
    })

    it("fail archive directory is not found",() =>{
        const problem = new Problem(nonRepositoryDir, currentProblem);
        assert.throw(() => problem.archive(), ErrorExistProblemDir.message);
    })

    it("fail unarchive directory is not found",() =>{
        const problem = new Problem(repositoryDir,currentProblem,true);
        assert.throw(() => problem.unarchive(), ErrorExistProblemDir.message);
    })

    it("fail unarchive isArchived is false",() =>{
        const problem = new Problem(repositoryDir,currentProblem);
        ErrorNoArchivedProblem.setMessage(currentProblem);
        assert.throw(() => problem.unarchive(), ErrorNoArchivedProblem.message);
    })

    it("success archive",() =>{
        const problem = new Problem(repositoryDir,currentProblem);
        
        assert.isTrue(fs.existsSync(problem.getProblemPath()));
        assert.isFalse(fs.existsSync(path.resolve(repositoryDir,PROBLEMSDIR,ARCHIVEDDIR)))
        
        problem.archive();

        assert.isTrue(fs.existsSync(path.resolve(repositoryDir,PROBLEMSDIR,ARCHIVEDDIR,`${currentProblem}`)))
        assert.isFalse(fs.existsSync(path.resolve(repositoryDir,PROBLEMSDIR,`${currentProblem}`)))
    })

    it("success unarchive",() =>{
        const problem = new Problem(repositoryDir1,currentProblem,true);

        assert.isTrue(fs.existsSync(problem.getProblemPath()));
        assert.isFalse(fs.existsSync(path.resolve(repositoryDir1,PROBLEMSDIR,`${currentProblem}`)));

        problem.unarchive();

        assert.isFalse(fs.existsSync(problem.getProblemPath()))
        assert.isTrue(fs.existsSync(path.resolve(repositoryDir1,PROBLEMSDIR,`${currentProblem}`)))

        
    })

})
