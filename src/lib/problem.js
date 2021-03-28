import path from 'path';
import fs from 'fs';

import log from '../utils/log';
import {PROBLEMSDIR, ARCHIVEDDIR, PROBLEMJS, PROBLEMMD, INFOJSON, TESTCASESJSON} from '../params';
import {readJSON, writeJSON} from '../utils/files/json';
import {isRepository} from '../utils/files/repository';
import {ErrorNoRepositoryFound, ErrorNoSelectedProblem} from '../utils/error'

export default class Problem {
    constructor(repository, problemNumber, isArchived=false) {
        this.repository = repository;
        this.problemNumber = problemNumber;
        this.isArchived = isArchived;
    }

    saveProblem(problem) {
        if(!isRepository(this.repository)) {
            throw ErrorNoRepositoryFound;
        }
        const problemPath = this.getProblemPath();
        fs.mkdirSync(problemPath, {recursive: true})
        fs.writeFileSync(path.resolve(problemPath, PROBLEMMD), problem.description);
        fs.writeFileSync(path.resolve(problemPath, PROBLEMJS), problem.code);
        writeJSON(path.resolve(problemPath, TESTCASESJSON), problem.testCases);
        writeJSON(path.resolve(problemPath, INFOJSON), problem.info);
    }

    getProblemPath(isArchived = this.isArchived) {
        if(isArchived){
            return path.resolve(this.repository, PROBLEMSDIR, ARCHIVEDDIR, `${this.problemNumber}`);
        } else {
            return path.resolve(this.repository, PROBLEMSDIR, `${this.problemNumber}`);
        }
    }

    getInfo() {
        return readJSON(path.resolve(this.getProblemPath(), INFOJSON));
    }

    getTestCases() {
        return readJSON(path.resolve(this.getProblemPath(), TESTCASESJSON));
    }

    createUserSolution(userID) {
        const userSolutionPath = this.getUserSolutionPath(userID);
        const problemjsPath = path.resolve(this.getProblemPath(), PROBLEMJS);
        fs.copyFileSync(problemjsPath, userSolutionPath);
    }

    getUserSolutionPath(userID) {
        return path.resolve(this.getProblemPath(), `${userID}.js`)
    }

    isUserSolutionExist(userID) {
        return fs.existsSync(this.getUserSolutionPath(userID))
    }

    displayInfo() {
        if(!this.problemNumber) {
            throw ErrorNoSelectedProblem;
        }
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
    
    changeFileName(beforePath, afterPath) {
        fs.renameSync(beforePath, afterPath);
    }

    archive(){
        const date = new Date();
        let info = this.getInfo();
        info.archived = date.toLocaleString();
        this.saveProblemInfo(info);

        this.isArchived = true;
        this.changeFileName(this.getProblemPath(false),this.getProblemPath(true));
    }

    changeUserSolutionName(beforeID,newUserID){
        this.changeFileName(this.getUserSolutionPath(beforeID),this.getUserSolutionPath(newUserID));
    }

    isProblemExist(){
        return fs.existsSync(this.getProblemPath())
    }
    
    saveProblemInfo(info) {
        writeJSON(path.resolve(this.getProblemPath(), INFOJSON), info);
    }
}
