import { Command } from 'commander';
import Context from '../../lib/context';
import Problem from '../../lib/problem';
import log from '../../utils/log'
import fs from 'fs';

const update = new Command('update');
update.arguments('[newUserID]')
update.description('현재의 ID를 입력받은 ID로 수정합니다');
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

        for(const problemNumber in context.data.problems.challenging){
            let problem = new Problem(context.repository,problemNumber);
            if(fs.existsSync(problem.getUserSolutionPath(beforeID))){
                problem.changeFileName(problem.getUserSolutionPath(beforeID),problem.getUserSolutionPath(newUserID));
            }
        }
        /* archive 폴더 접근 관련하여 잠시 보류
        for(const problemNumber in context.data.problems.archived){
            let problem = new Problem("",problemNumber);
            problem.changeFileName(problem.getUserSolutionPath(beforeID),problem.getUserSolutionPath(newUserID));
        }
        */
    } catch (err) {
        log.error(err.message);
        process.exit(err.code);
    }
});

export default update;
