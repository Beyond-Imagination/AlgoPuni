import path from 'path';
import fs from 'fs';
import log from '../utils/log'

import {PROBLEM, SOLUTION} from '../params';
import {readJSON} from '../utils/files/json';

export default class Executor {
    constructor(context) {
        this.context = context;
        // TODO make problem lib.
        this.problemPath = path.resolve(this.context.repository, PROBLEM, `${this.context.user.currentProblem}`); 
        this.userCodePath = path.resolve(this.problemPath, `${this.context.user.userID}.js`)
        this.casesPath = path.resolve(this.problemPath, "cases.json")
        this.solutionPath = path.resolve(this.context.repository, SOLUTION);
    }

    async exec() {
        this.copySolution()
        this.setExecutable()
        const solution = await this.getSolution()
        const testSet = this.getTestSet()
        this.deleteSolution()
        this.marking(solution, testSet)
    }

    copySolution() {
        fs.copyFileSync(this.userCodePath, this.solutionPath)
    }

    setExecutable() {
        fs.appendFileSync(this.solutionPath, '\nexport default solution;');
    }

    async getSolution() {
        const solution = await import(this.solutionPath);
        return solution.default;
    }

    getTestSet() {
        return readJSON(this.casesPath);
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