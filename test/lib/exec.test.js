import path from 'path';
import chai from 'chai';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';
import faker from 'faker';

import {PROBLEM, SOLUTION} from '../../src/params';
import {createRepository} from '../../src/utils/files/repository';
import Executor from '../../src/lib/executor';
import {Context} from '../../src/lib/context';

const userID = faker.name.firstName();
const currentProblem = faker.random.number();

const repositoryDir = path.resolve("/","lib","exec","repo");
const nonRepositoryDir = path.resolve("/","lib","exec","non-repo");
const problemDir = path.resolve(repositoryDir, PROBLEM, `${currentProblem}`);

const solutionString = `function solution(x, y){
    return x+y;
}
`

const casesString = `{
    "inputs": ["x", "y"],
	"cases": [
		{
			"x": 1,
            "y": 2,
            "_result": 3
		}
	]
}`

const context = new Context(repositoryDir);
context.user.userID = userID;
context.user.currentProblem = currentProblem;

let assert = chai.assert;

describe("executor", () => {
    before(() => {
        vol.mkdirSync(repositoryDir, {recursive: true})
        vol.mkdirSync(nonRepositoryDir, {recursive: true})
        vol.mkdirSync(problemDir, {recursive: true})
        patchFs(vol);
        fs.writeFileSync(path.resolve(problemDir, `${context.user.userID}.js`), solutionString)
        fs.writeFileSync(path.resolve(problemDir, "cases.json"), casesString)
        createRepository(repositoryDir)
    })

    it("copy solution", () => {
        const executor = new Executor(context);
        executor.copySolution();
        const isExist = fs.existsSync(path.resolve(repositoryDir, SOLUTION))
        assert.isTrue(isExist, "fail to create data json")
        const file = fs.readFileSync(path.resolve(repositoryDir, SOLUTION))
        assert.equal(file.toString(), solutionString)
        fs.unlinkSync(path.resolve(repositoryDir, SOLUTION));
    })

    it("set executable", () => {
        const executor = new Executor(context);
        executor.copySolution();
        executor.setExecutable();
        const isExist = fs.existsSync(path.resolve(repositoryDir, SOLUTION))
        assert.isTrue(isExist)
        const file = fs.readFileSync(path.resolve(repositoryDir, SOLUTION))
        assert.equal(file.toString(), `${solutionString}\nexport default solution;`)
        fs.unlinkSync(path.resolve(repositoryDir, SOLUTION));
    })

    // memefs 를 사용한 mocking 과 javascript 동적 import 가 충돌하여 해당 함수 테스트 진행 불가능. 다른 테스트 방식이 필요
    // it("get solution", async () => {
    //     const executor = new Executor(context);
    //     executor.solutionPath = "../../../test/lib/exec/solution.js"
    //     const solution = await executor.getSolution();
    // })

    it("get testset", () => {
        const executor = new Executor(context);
        const testset = executor.getTestSet();
        const cases = fs.readFileSync(path.resolve(problemDir, "cases.json"))
        assert.equal(cases, casesString)
    })

    it("delete solution", () => {
        const executor = new Executor(context);
        executor.copySolution();
        let isExist = fs.existsSync(path.resolve(repositoryDir, SOLUTION))
        assert.isTrue(isExist)
        executor.deleteSolution();
        isExist = fs.existsSync(path.resolve(repositoryDir, SOLUTION))
        assert.isFalse(isExist)
    })

    it("success marking", () => {
        const executor = new Executor(context);
        const testset = executor.getTestSet();
        const solution = (x,y) => x+y;
        executor.marking(solution, testset);
    })

    it("fail marking", () => {
        const executor = new Executor(context);
        const testset = executor.getTestSet();
        const solution = (x,y) => x-y;
        assert.throw(() => executor.marking(solution, testset))
    })

    // get solution 을 내부에서 호출하는 관계로 테스트 불가능
    // it("exec test", async () => {
    //     const executor = new Executor(context);
    //     await executor.exec();
    // })
})
