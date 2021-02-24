import fs from 'fs';
import path from 'path';

import {DATAJSON} from '../../params';
import {findRepository} from '../../utils/files/repository';
import {readJSON, writeJSON} from '../../utils/files/json';

export class Data {
    constructor(repository=findRepository()) {
        this.repository = repository;
        this.path = path.resolve(this.repository, DATAJSON)
        this.users = {};
        this.problems = {
            challenging: [],
            archived: [],
            thisWeek: []
        };
    }

    create() {
        if (fs.existsSync(this.path)) {
            return;
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
                challenging: this.problems.challenging,
            };
        } else {
            throw new Error("already exist user id")
        }
    }

    toJSON() {
        return {
            users: this.users,
            problems: this.problems,
        }
    }
    changeUserName(beforeID,afterID){
        if(beforeID === afterID)    throw new Error("바꾸고자 하는 ID가 동일합니다.")
        if(this.users[afterID]) throw new Error(afterID +" is already existed")
        
        this.users[afterID] = this.users[beforeID];
        delete this.users[beforeID];
        return;
    }        
}
