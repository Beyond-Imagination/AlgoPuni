import { Command } from 'commander';
import Context from '../../lib/context';
import Problem from '../../lib/problem'
import log from '../../utils/log';

const unsolved = new Command('unsolved');
unsolved.description('shows the unsolved problems that user has not yet solved');
unsolved.action(() => {
    try {
        const context = new Context();
        context.read();
        // 1. /.algopuni/user.json 을 읽어 userID 를 알아냅니다.
        const id = context.user.userID;

        // 2. /.algopuni/data.json 에서 해당 userID 의 challenging 을 알아냅니다.
        const challenging = context.data.users[id].challenging;

        for (let problemNumber of challenging) {
            // 3. challenging 문제들의 info.json 을 읽습니다.
            const problem = new Problem(context.repository, problemNumber);

            // 4. 해당 문제들의 번호, 제목, 풀어야하는 기간을 출력합니다.
            problem.displayInfo();
        }
    } catch (err) {
        log.error(err.message);
    }
});

export default unsolved;
