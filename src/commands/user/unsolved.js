import { Command } from 'commander';
import Context from '../../lib/context';
import Problem from '../../lib/problem'
import log from '../../utils/log';

const unsolved = new Command('unsolved');
unsolved.description('사용자가 풀지 않은 문제의 정보를 출력합니다.');
unsolved.action(() => {
    try {
        const context = new Context();
        context.read();
        // 1. /.algopuni/user.json 을 읽어 userID 를 알아냅니다.
        const id = context.user.userID;

        // 2. /.algopuni/data.json 에서 해당 userID 의 unsolved 을 알아냅니다.
        const unsolved = context.data.users[id].unsolved;

        if(!unsolved.length) {
            log.info('모든 문제를 풀었습니다.');
            return;
        }

        for (let problemNumber of unsolved) {
            // 3. unsolved 문제들의 info.json 을 읽습니다.
            const problem = new Problem(context.repository, problemNumber);

            // 4. 해당 문제들의 번호, 제목, 풀어야하는 기간을 출력합니다.
            problem.displayInfo();
        }
    } catch (err) {
        log.error(err.message);
        process.exit(err.code);
    }
});

export default unsolved;
