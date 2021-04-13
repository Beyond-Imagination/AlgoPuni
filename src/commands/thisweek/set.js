import { Command } from 'commander'
import { ErrorNoProblemsUnsolvedCheck, errorHandler } from '../../utils/error';

import Context from '../../lib/context';
// import Problem from '../../lib/problem';

const set = new Command('set');
set.description('입력 받은 문제 번호를 이번 주 문제로 지정합니다');
set.arguments('<problemNumbers...>')
set.action((problemNumbers) => {
    try {
        const context = new Context();
        context.read();
        context.data.problems.thisWeek.length = 0;

        for (let inputThisweekNum of problemNumbers) {
            inputThisweekNum = Number(inputThisweekNum);
            if (context.data.problems.unsolved.indexOf(inputThisweekNum) === -1) {
                throw ErrorNoProblemsUnsolvedCheck.setMessage(inputThisweekNum);
            }
            // dead line 부분 이슈 처리
            // const problem = new Problem(context.repository, inputThisweekNum);
            // problem.setDeadline();              

            context.data.problems.thisWeek.push(inputThisweekNum);
        }
        context.write();
    } catch (error) {
        errorHandler(error);
    }
});

export default set;