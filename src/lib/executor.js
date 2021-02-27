import path from 'path';
import fs from 'fs';
import log from '../utils/log'

import {PROBLEMDIR} from '../params';
import {readJSON} from '../utils/files/json';
import Problem from './problem';

export default class Executor {
    constructor(context) {
        this.context = context;
        this.problem = new Problem(this.context.repository, this.context.user.challenging);
    }

    async exec() {
        const solution = await this.getSolution()
        const testCases = this.problem.getTestCases()
        return this.marking(solution, testCases)
    }

    async getSolution() {
        let solution = await import(this.problem.getUserSolutionPath(this.context.user.userID));
        return solution.default;
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
        
        let result;
        if (failCase.length) {
            log.info(`다음 케이스를 확인하세요. case: ${failCase}`);
            result = false;
        } else {
            log.info("모든 테스트 케이스를 통과하였습니다.");
            result = true;
        }
        log.info(`========== Test End ==========`);
        return result;
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
