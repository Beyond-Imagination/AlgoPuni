import { Command } from 'commander'

import Context from '../../lib/context';
import Problem from '../../lib/problem';
import { errorHandler, ErrorExistProblemDir } from '../../utils/error';

const challenge = new Command('challenge');
challenge.description('해당 문제를 풀기 위한 파일을 생성합니다.');
challenge.arguments('<problemNumber>')
challenge.action((problemNumber) => {
    try {
        const context = new Context();
        context.read();
        problemNumber = Number(problemNumber);
        const userID = context.user.userID;
        context.user.challenging = problemNumber;

        const problem = new Problem(context.repository, problemNumber);
        if (!problem.isProblemExist()) {
            throw ErrorExistProblemDir.setMessage(problemNumber);
        }

        if (!problem.isUserSolutionExist(userID)) {
            problem.createUserSolution(userID);
        }

        context.user.write();
    } catch (error) {
        errorHandler(error);
    }
});

export default challenge;