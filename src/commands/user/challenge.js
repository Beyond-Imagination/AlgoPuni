import path from 'path'
import { Command } from 'commander'

import Context from '../../lib/context';
import Problem from '../../lib/problem'
import log from '../../utils/log'

const challenge = new Command('challenge');
challenge.description('Display user\'s current Problem number');
challenge.action(() => {
    try {
        const context = new Context();
        context.read();

        let problemNum = context.user.currentProblem;

        const problem = new Problem(context.repository, problemNum);
        problem.displayInfo();
    } catch(err) {
        log.error(err.message);
    }
    
});

export default challenge;