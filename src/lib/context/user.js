import fs from 'fs';
import path from 'path';

import {USERJSON} from '../../params';
import {findRepository} from '../../utils/files/repository';
import {readJSON, writeJSON} from '../../utils/files/json';

export class User {
    constructor(repository=findRepository()) {
        this.repository = repository;
        this.path = path.resolve(this.repository, USERJSON);
        this.userID = "";
        this.currentProblem = 0;
    }

    create() {
        if (fs.existsSync(this.path)) {
            return;
        }
        this.askUserInfo();
        this.write();
    }

    askUserInfo () {
        let id = "name" // TODO get user id from prompt
        
        this.userID = id;
    }

    read() {
        const user = readJSON(this.path);
        Object.assign(this, user);
    }

    write() {
        writeJSON(this.path, this.toJSON());
    }

    toJSON() {
        return {
            userID: this.userID,
            currentProblem: this.currentProblem,
        }
    }
}
