import path from 'path';
import fs from 'fs';
import log from '../utils/log'

import {PROBLEMDIR, SOLUTION} from '../params';
import {readJSON} from '../utils/files/json';
import Problem from './problem';

export default class Executor {
    constructor(context) {
        this.context = context;
        this.problem = new Problem(this.context.repository, this.context.user.currentProblem);
        this.solutionPath = path.resolve(this.context.repository, SOLUTION);
    }

    async exec() {
        this.copySolution()
        this.setExecutable()
        const solution = await this.getSolution()
        const testSet = this.problem.getTestCases()
        this.deleteSolution()
        this.marking(solution, testSet)
    }

    copySolution() {
        const userSolutionPath = this.problem.getUserSolutionPath(this.context.user.userID)
        fs.copyFileSync(userSolutionPath, this.solutionPath)
    }

    setExecutable() {
        fs.appendFileSync(this.solutionPath, '\nexport default solution;');
    }

    async getSolution() {
        const solution = await import(this.solutionPath);
        return solution.default;
    }

    deleteSolution() {
        fs.unlinkSync(this.solutionPath);
    }

    marking(solution, testSet) {
        const inputs = testSet.inputs;
        const failCase = []
        testSet.cases.forEach((testCase, index) => {
            const input = inputs.map(x => testCase[x])
            const result = solution(...input);
            this.printResult(index+1, input, testCase._result, result)
            if(testCase._result !== result) {
                failCase.push(index+1);
            }
        })
        if (failCase.length) {
            throw new Error(`테스트 실패. 다음 케이스를 확인하세요. case: ${failCase}`)
        }
        log.info(`========== Success All Test ==========`)
    }

    printResult(index, input, expect, result, time) {
        log.info(`========== Test Case ${index} 번 ==========`);
        log.info(`input: ${input}`);
        log.info(`expect: ${expect}`);
        log.info(`result: ${result}`);
        if(expect === result) {
            log.info(`테스트 통과`)
        } else {
            log.info(`테스트 실패`)
        }
        // TODO add time log
    }
}