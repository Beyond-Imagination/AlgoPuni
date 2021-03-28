import { Command } from 'commander'

import Context from '../../lib/context';
import Executor from '../../lib/executor';
import log from '../../utils/log'
import Problem from '../../lib/problem'
import { errorHandler, ErrorProblemUnpassed, ErrorUserUnsolvedCheck, ErrorNoProblemsUnsolvedCheck } from '../../utils/error';

const archive = new Command('archive');
archive.arguments('<problemNumber...>')
archive.description('모두가 푼 문제를 따로 저장합니다.');
archive.action(async (problemNumber) => {
    try {
        const context = new Context();
        context.read();

        for (let archivingNum of problemNumber) {
            archivingNum = Number(archivingNum);

            if (context.data.problems.unsolved.indexOf(archivingNum) === -1) {
                throw ErrorNoProblemsUnsolvedCheck.setMessage(archivingNum);
            }

            let userUnsolvedCheck = new Array();
            for (const element in context.data.users) {
                if (context.data.users[element].unsolved.indexOf(archivingNum) !== -1) {
                    userUnsolvedCheck.push(element);
                }
            }
            if (userUnsolvedCheck.length) {
                throw ErrorUserUnsolvedCheck.setMessage(userUnsolvedCheck);
            }

            const executor = new Executor(context);
            executor.problem.problemNumber = archivingNum;
            let problemUnpassedCheck = new Array();
            for (const element in context.data.users) {
                executor.context.user.userID = element;
                if (await executor.exec()) {
                    log.info(element + ' 사용자가 ' + archivingNum + '번 문제의 testcase를 통과하였습니다.');
                }
                else {
                    log.info(element + ' 사용자가 ' + archivingNum + '번 문제를 다 풀지 못했습니다.');
                    problemUnpassedCheck.push(element);
                }
            }
            if (problemUnpassedCheck.length) {
                throw ErrorProblemUnpassed.setMessage(problemUnpassedCheck);
            }

            const problem = new Problem(context.repository, archivingNum);
            problem.archive();

            context.data.problems.archived.push(archivingNum);
            let indexUnsolved = context.data.problems.unsolved.indexOf(archivingNum);
            context.data.problems.unsolved.splice(indexUnsolved, 1);
            context.write();
            log.info(archivingNum,'번 문제를 archive 완료하였습니다.');
        }
    } catch (error) {
        errorHandler(error);
    }
});

export default archive;
