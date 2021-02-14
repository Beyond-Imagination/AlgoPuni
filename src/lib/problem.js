import path from 'path';
import fs from 'fs';

import {PROBLEMDIR, PROBLEMJS, PROBLEMMD, INFOJSON, TESTCASESJSON} from '../params';
import {readJSON} from '../utils/files/json';

export default class Problem {
    constructor(repository, problemNumber) {
        this.repository = repository;
        this.problemNumber = problemNumber;
        this.problemPath = path.resolve(this.repository, PROBLEMDIR, `${this.problemNumber}`);
    }

    saveProblem(problem) {
        // TODO 크롤러를 통해 problem 정보를 얻어 낸후 object 로 만들어서 해당 함수 호출
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
