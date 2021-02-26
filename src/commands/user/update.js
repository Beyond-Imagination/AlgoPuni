import { Command } from 'commander';
import Context from '../../lib/context';
import Problem from '../../lib/problem';
import log from '../../utils/log'

const update = new Command('update');
update.arguments('[newUserID]')
update.description('현재의 사용자 이름을 입력받은 이름으로 수정합니다');
update.action(async(newUserID) => {
    try {
        const context = new Context();
        context.read();
        let beforeID = context.user.userID;
        
        if (!newUserID) {
            newUserID = await context.user.askUserID();
        }

        context.user.userID = newUserID;
        context.data.changeUserName(beforeID,newUserID);
        context.write();

        let problem = new Problem(context.repository,"");
        for(const element of context.data.problems.unsolved){
            problem.problemNumber = element;
            if(problem.isUserSolutionExist(beforeID)){
                problem.changeUserSolutionName(beforeID,newUserID);
            }
        }

        let problemArchived = new Problem(context.repository,"",true);
        for(const element of context.data.problems.archived){
            problemArchived.problemNumber = element;
            if(problemArchived.isUserSolutionExist(beforeID)){
                problemArchived.changeUserSolutionName(beforeID,newUserID);
            }
        }        
    } catch (err) {
        log.error(err.message);
        process.exit(err.code);
    }
});

export default update;
