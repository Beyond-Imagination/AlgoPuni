import { Command } from 'commander'

import {Context} from '../../lib/context';
import Crawler from '../../lib/crawler';
import Problem from '../../lib/problem';

const add = new Command('add');
add.description('problem add description');
add.action(async () => {
    // let context = new Context();
    // context.read();
    // problemNumber(12938);
    // const crawler = new Crawler(problemNumber);
    // const problem = new Problem(context.repository, problemNumber);
    // const problemInfo = await crawler.crawl();
    // problem.saveProblem(problemInfo);
});

export default add;
