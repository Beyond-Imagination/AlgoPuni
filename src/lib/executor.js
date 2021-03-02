import path from 'path';
import fs from 'fs';
import microtime from 'microtime';

import log from '../utils/log';
import Problem from './problem';
import {ErrorNoUserSolution, ErrorExecuteSolution} from '../utils/error';

export default class Executor {
    constructor(context) {
        this.context = context;
        this.problem = new Problem(this.context.repository, this.context.user.challenging);
    }

    async exec() {
        log.debug("call Executor.exec()")
        try {
            const solution = await this.getSolution();
            const testCases = this.problem.getTestCases();
            return this.marking(solution, testCases);
        } catch (error) {
            log.debug("Executor.exec() fail", error);
            throw error;
        }
    }

    async getSolution() {
        try {
            let solution = await import(this.problem.getUserSolutionPath(this.context.user.userID));
            return solution.default;
        } catch (error) {
            throw ErrorNoUserSolution.setMessage(this.context.user.challenging);
        }
    }

    marking(solution, testCases) {
        try {
            const inputs = testCases.inputs;
            const outputs = testCases.outputs;
            const failCase = [];

            for(let i=0; i<inputs.length; i++){
                let input = inputs[i];
                let output = outputs[i];
                let before = microtime.nowDouble();
                const result = solution(...input);
                let after = microtime.nowDouble();
                if(output !== result) {
                    failCase.push(i+1);
                }
                this.printResult(i+1, input, output, result, (after-before)*1000)
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
        } catch (error) {
            log.debug("Executor.marking() fail", error.message);
            throw ErrorExecuteSolution;
        }
    }

    printResult(index, input, expect, result, time) {
        log.info(`========== Test Case ${index} 번 ==========`);
        log.info(`input:`, input);
        log.info(`expect:`, expect);
        log.info(`result:`, result);
        log.info(`time: ${time.toFixed(3)}ms`)
        if(expect === result) {
            log.info(`테스트 통과`)
        } else {
            log.info(`테스트 실패`)
        }
    }
}
