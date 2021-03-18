import { Command } from 'commander'
import Context from '../../lib/context';
import Crawler from '../../lib/crawler';
import Problem from '../../lib/problem';
import {errorHandler,ErrorExistProblemNumber} from '../../utils/error';

const add = new Command('add');
add.arguments('<problemNumber>')
add.description('링크나 프로그래머스의 문제번호를 입력받아 저장합니다.');
add.action(async (problemNumber) => {
    try {
        const context = new Context();
        context.read();
        const problem = new Problem(context.repository, problemNumber);
        problemNumber = Number(problemNumber);

        function checkExistProblemNumber(x){
            return problemNumber === x;
        }
        
        if(context.data.problems.unsolved.filter(checkExistProblemNumber).length || context.data.problems.archived.filter(checkExistProblemNumber).length ) {
            throw ErrorExistProblemNumber;
        }

        const crawler = new Crawler(problemNumber, context.user.programmers);
        const problemInfo = await crawler.crawl();
        problem.saveProblem(problemInfo);
    
        for(const [userID,userInfo] of Object.entries(context.data.users)){
            userInfo.unsolved.push(problemNumber);
        }
        context.data.problems.unsolved.push(problemNumber);

        context.write();
    } catch (error) {
        errorHandler(error);
    }
});

export default add;
