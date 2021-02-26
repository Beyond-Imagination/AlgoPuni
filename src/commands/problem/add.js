import { Command } from 'commander'

import Context from '../../lib/context';
import Crawler from '../../lib/crawler';
import Problem from '../../lib/problem';

const add = new Command('add');
add.description('링크나 프로그래머스의 문제번호를 입력받아 저장합니다.');
add.action(async () => {
    // let context = new Context();
    // context.read();
    // const problemNumber = 43162;
    // const crawler = new Crawler(problemNumber);
    // const problem = new Problem(context.repository, problemNumber);
    // const problemInfo = await crawler.crawl();
    // problem.saveProblem(problemInfo);
});

export default add;
