import { Command } from 'commander'

import Context from '../../lib/context'
import Problem from '../../lib/problem'
import {errorHandler, ErrorNoArchivedProblem} from '../../utils/error'

const unarchive = new Command('unarchive');
unarchive.arguments('<problemNumbers...>');
unarchive.description('다 풀어서 따로 저장해둔 문제를 다시 불러옵니다.', {
    problemNumbers : '아카이빙을 해제할 문제 번호들'
});
unarchive.action(async (problemNumbers) => {
    try {
        let context = new Context();
        context.read();

        const set = new Set(problemNumbers);
        problemNumbers = [...set];

        for(let unarchivedNum of problemNumbers){
            unarchivedNum = Number(unarchivedNum);
            if(context.data.isArchivedProblem(unarchivedNum) === false){
                throw ErrorNoArchivedProblem.setMessage(unarchivedNum);
            }
        }

        for (let unarchivedNum of problemNumbers) {
            unarchivedNum = Number(unarchivedNum);
            const problem = new Problem(context.repository, unarchivedNum, true);
            problem.unarchive();

            let indexArchived = context.data.problems.archived.indexOf(unarchivedNum);
            context.data.problems.archived.splice(indexArchived, 1);

            context.data.problems.unsolved.push(unarchivedNum);
        }
        context.data.problems.unsolved.sort();

        context.write();
        
    } catch (error) {
        errorHandler(error);
    }
});

export default unarchive;
