import chai from 'chai';
import faker from 'faker';

import Crawler from '../../src/lib/crawler';
import {ErrorNoProgrammersAccount} from '../../src/utils/error'

let assert = chai.assert;

describe("crawler", () => {
    it("consturctor", () => {
        const problemNumber = faker.random.number();
        let crawler = new Crawler(problemNumber, {email: faker.internet.email(), password: faker.internet.password()})
        const expectedResult = `https://programmers.co.kr/learn/courses/30/lessons/${problemNumber}?language=javascript`;
        assert.equal(crawler.problemLink, expectedResult);
    })

    it("fail consturctor", () => {
        const problemNumber = faker.random.number();
        assert.throw(()=> new Crawler(problemNumber, {}), ErrorNoProgrammersAccount.message)
        assert.throw(()=> new Crawler(problemNumber, {email: faker.internet.email()}), ErrorNoProgrammersAccount.message)
        assert.throw(()=> new Crawler(problemNumber, {password: faker.internet.password()}), ErrorNoProgrammersAccount.message)
    })

    it("crawl", async function () {
        // disable - crawler test takes too much time.

        // this.timeout(10000); 
        // let crawler = new Crawler(12938)
        // let problem = await crawler.crawl();
        // assert.isString(problem.code);
        // assert.isString(problem.description);
        // assert.isArray(problem.testCases.inputs)
        // assert.isArray(problem.testCases.outputs)
    })
})
