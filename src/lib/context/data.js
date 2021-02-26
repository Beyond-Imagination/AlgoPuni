import fs from 'fs';
import path from 'path';

import {DATAJSON} from '../../params';
import {findRepository} from '../../utils/files/repository';
import {readJSON, writeJSON} from '../../utils/files/json';
import {ErrorExistUserID, ErrorSameUserIDAsBefore} from '../../utils/error';

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
}
