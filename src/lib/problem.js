import path from 'path';
import fs from 'fs';

import log from '../utils/log';
import {PROBLEMSDIR, PROBLEMJS, PROBLEMMD, INFOJSON, TESTCASESJSON} from '../params';
import {readJSON, writeJSON} from '../utils/files/json';
import {isRepository} from '../utils/files/repository';

export default class Problem {
    constructor(repository, problemNumber) {
        this.repository = repository;
        this.problemNumber = problemNumber;
        this.problemPath = path.resolve(this.repository, PROBLEMSDIR, `${this.problemNumber}`);
    }

    saveProblem(problem) {
        if(!isRepository(this.repository)) {
            throw new Error("not an algopuni repository")
        }
        fs.mkdirSync(this.problemPath, {recursive: true})
        fs.writeFileSync(path.resolve(this.problemPath, PROBLEMMD), problem.description);
        fs.writeFileSync(path.resolve(this.problemPath, PROBLEMJS), problem.code);
        writeJSON(path.resolve(this.problemPath, TESTCASESJSON), problem.testCases);
        writeJSON(path.resolve(this.problemPath, INFOJSON), problem.info);
    }

    getInfo() {
        return readJSON(path.resolve(this.problemPath, INFOJSON));
    }

    getTestCases() {
        return readJSON(path.resolve(this.problemPath, TESTCASESJSON));
    }

    createUserSolution(userID) {
        const userSolutionPath = this.getUserSolutionPath(userID);
        const problemjsPath = path.resolve(this.problemPath, PROBLEMJS);
        fs.copyFileSync(problemjsPath, userSolutionPath);
    }

    getUserSolutionPath(userID) {
        return path.resolve(this.problemPath, `${userID}.js`)
    }

    displayInfo() {
        let problemInfo = this.getInfo();

        log.info("********************");
        log.info("*** Problem Info ***");
        log.info("********************");
        log.info("Problem Number : " + `${this.problemNumber}`);
        log.info("Title          : " + `${problemInfo.title}`);
        // log.info("Level          : " + `${problemInfo.level}`); // level is not supported
        log.info("Deadline       : " + `${problemInfo.deadline}`);
        log.info("Archived       : " + `${problemInfo.archived}`);
        log.info("********************");
    }
    
    changeFileName(beforeName, afterName) {
        fs.renameSync(beforeName, afterName);
    }
}
