import path from 'path';
import fs from 'fs';

import {PROBLEMDIR, PROBLEMJS, PROBLEMMD, INFOJSON, TESTCASESJSON} from '../params';
import {readJSON, writeJSON} from '../utils/files/json';
import {isRepository} from '../utils/files/repository';

export default class Problem {
    constructor(repository, problemNumber) {
        this.repository = repository;
        this.problemNumber = problemNumber;
        this.problemPath = path.resolve(this.repository, PROBLEMDIR, `${this.problemNumber}`);
    }

    saveProblem(problem) {
        if(!isRepository(this.repository)) {
            throw new Error("not an algopuni repository")
        }
        fs.mkdirSync(this.problemPath, {recursive: true})
        fs.writeFileSync(path.resolve(this.problemPath, PROBLEMMD), problem.description);
        fs.writeFileSync(path.resolve(this.problemPath, PROBLEMJS), problem.code);
        writeJSON(path.resolve(this.problemPath, TESTCASESJSON), problem.testCases);
        // TODO save info.json
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
}
