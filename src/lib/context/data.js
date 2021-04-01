import fs from 'fs';
import path from 'path';

import {DATAJSON} from '../../params';
import {findRepository} from '../../utils/files/repository';
import {readJSON, writeJSON} from '../../utils/files/json';
import {ErrorExistUserID, ErrorSameUserIDAsBefore, ErrorExistDataJSON} from '../../utils/error';

const INVALID_INDEX = -1;

export default class Data {
    constructor(repository=findRepository()) {
        this.repository = repository;
        this.path = path.resolve(this.repository, DATAJSON)
        this.users = {};
        this.problems = {
            unsolved: [],
            archived: [],
            thisWeek: []
        };
    }

    create() {
        if (fs.existsSync(this.path)) {
            throw ErrorExistDataJSON;
        }
        this.write();
    }

    read() {
        const data = readJSON(this.path);
        Object.assign(this, data);
    }

    write() {
        writeJSON(this.path, this.toJSON());
    }

    addUser(user) {
        if (!this.users[user.userID]){
            this.users[user.userID] = {
                unsolved: this.problems.unsolved,
            };
        } else {
            throw ErrorExistUserID;
        }
    }

    toJSON() {
        return {
            users: this.users,
            problems: this.problems,
        }
    }
    
    changeUserName(beforeID,afterID){
        if(beforeID === afterID)    throw ErrorSameUserIDAsBefore;
        if(this.users[afterID])     throw ErrorExistUserID;
        
        this.users[afterID] = this.users[beforeID];
        delete this.users[beforeID];
        return;
    }

    isExistedProblem(problemNum){
        if(this.problems.unsolved.indexOf(problemNum) !== INVALID_INDEX)
            return true;
        else if(this.problems.archived.indexOf(problemNum) !== INVALID_INDEX)
            return true;

        return false;
    }

    isArchivedProblem(problemNum){
        if(this.problems.archived.indexOf(problemNum) === INVALID_INDEX)
            return false;

        return true;
    }
}
