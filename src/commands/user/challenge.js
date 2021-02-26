import path from 'path'
import { Command } from 'commander'

import Context from '../../lib/context';
import Problem from '../../lib/problem'
import log from '../../utils/log'

const challenge = new Command('challenge');
challenge.description('사용자가 풀고 있는 문제의 정보를 출력합니다');
challenge.action(() => {
    try {
        const context = new Context();
        context.read();

        let problemNum = context.user.currentProblem;

        const problem = new Problem(context.repository, problemNum);
        problem.displayInfo();
    } catch(err) {
        log.error(err.message);
        process.exit(err.code);
    }
});

export default challenge;
