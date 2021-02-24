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
        const testCases = this.problem.getTestCases()
        this.deleteSolution()
        this.marking(solution, testCases)
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

    marking(solution, testCases) {
        const inputs = testCases.inputs;
        const outputs = testCases.outputs;
        const failCase = []

        for(let i=0; i<inputs.length; i++){
            let input = inputs[i]
            let output = outputs[i]
            const result = solution(...input);
            if(output !== result) {
                failCase.push(i+1);
            }
            this.printResult(i+1, input, output, result)
        }
        
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
