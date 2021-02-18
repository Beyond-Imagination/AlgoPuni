const puppeteer = require("puppeteer");

export default class Crawler {
    constructor(problemNumber, programmers) {
        this.problemLink = `https://programmers.co.kr/learn/courses/30/lessons/${problemNumber}?language=javascript`;
        if(!programmers.email) {
            throw new Error("no programmers account information");
        }
        this.programmers = programmers;
    }

    async crawl() {
        const browser = await puppeteer.launch();
        const problem = {}
        try {
            const page = await browser.newPage();
            await this.goToProblemPage(page);
            await this.login(page);
            problem.description = await this.getDescription(page);
            problem.code = await this.getInitalCode(page);
            problem.testCases = await this.getTestCases(page);
        } catch(error) {
            throw new Error("fail to get problem information");
        } finally {
            await browser.close();
        }
        
        return problem;
    }

    async goToProblemPage(page) {
        await page.goto(this.problemLink);
        for(let i=0; i<7; i++){
            try {
                let selector = `#step-${i} > div.popover-navigation.d-flex.justify-content-between > div.btn-group > button:nth-child(2)`
                await page.click(selector)
                await page.waitForTimeout(500);
            } catch (error) {
                // skip no exist button
            }
        }
    }

    async login(page) {
        let selector = "body > div.main.theme-dark > div > div > div.button-section > div.func-buttons > a"
        await page.click(selector)
        await page.waitForTimeout(300);
        await page.focus("#user_email")
        await page.keyboard.type(this.programmers.email);
        await page.focus("#user_password")
        await page.keyboard.type(this.programmers.password);
        await page.click("#btn-sign-in")
        await page.waitForTimeout(300);
    }

    async getDescription(page) {
        const selector = "#tour2 > div"
        let description = await page.$eval(selector, element => element.innerHTML);
        return description;
    }

    async getInitalCode(page) {
        const selector = "#code"
        let code = await page.$eval(selector, element => element.value);
        return code;
    }

    async getTestCases(page) {
        await page.click("body > div.main.theme-dark > div > div > div.button-section > div.testcase-button > a.btn.btn-dark.btn-block");
        await page.waitForTimeout(200);
        let caseLength = await page.$$eval("#testcase-input-list tr", list => list.length-1);
        let crawlledInputs = await page.$$eval("#testcase-input-list input", list => list.map(input => input.value));
        let crawlledOutputs = await page.$$eval("#testcase-output input", list => list.map(output => output.value));

        let inputs = Array.from(Array(caseLength), () => new Array(0));
        let outputs =  new Array(caseLength);
        
        let inputLength = parseInt(crawlledInputs.length/caseLength);
        crawlledInputs.forEach((input, i) => {
            input = JSON.parse(input);
            let j = parseInt(i/inputLength);
            inputs[j].push(input);
        })

        crawlledOutputs.forEach((output, i) => {
            outputs[i] = JSON.parse(output);
        })

        let testCases = {
            inputs: inputs,
            outputs: outputs,
        }
        
        return testCases;
    }
}