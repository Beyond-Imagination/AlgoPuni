import { Command } from 'commander'
import Context from '../../lib/context';
import Executor from '../../lib/executor';
import log from '../../utils/log'
import { errorHandler, ErrorTestCaseFail, ErrorZeroProblemNumber } from '../../utils/error';
import challenge from '../user/challenge';

const solve = new Command('solve');
solve.description('풀이가 완료 된 문제를 동기화합니다');
solve.action(async () => {
    try {
        // 1. /.algopuni/user.json 을 읽어 userID와 currentProblem 을 알아냅니다.
        const context = new Context();
        context.read();
        const executor = new Executor(context);

        // 2. 해당 문제의 exec 함수를 실행하여 모든 test case 를 통과하는지 확인합니다.
        let userID = context.user.userID;
        let challenging = context.user.challenging;

        if (challenging === 0) {
            throw ErrorZeroProblemNumber;
        }
    
        if (await executor.exec()) {
            let indexChallenging = context.data.users[userID].unsolved.indexOf(challenging);
            if (indexChallenging === -1) {
                log.info("이미 푼 문제입니다.")
                return;
            } else {
                // 3. /.algopuni/data.json 에 userID 의 challenging 에서 currentProblem 을 제거합니다.
                context.data.users[userID].unsolved.splice(indexChallenging, 1);
                context.user.challenging = 0;
                context.write();
            }
        } else {
            throw ErrorTestCaseFail.setMessage(challenging);
        }
        
    } catch (error) {
        errorHandler(error);
    }
});

export default solve;
