import fs from 'fs';
import path from 'path';

import {USERJSON} from '../../params';
import {findRepository} from '../files/repository';
import {readJSON, writeJSON} from '../files/json';

export class User {
    constructor(repository=findRepository()) {
        this.repository = repository;
    }

    create() {
        if (fs.existsSync(path.resolve(this.repository, USERJSON))) {
            return;
        }
        this.askUserInfo();
        this.write();
    }

    askUserInfo () {
        let id = "name" // TODO get user id from prompt
        
        this.userID = id;
        this.currentProblem = 0;
        this.challenging = [];
    }

    read() {
        const user = readJSON(path.resolve(this.repository, USERJSON));
        Object.assign(this, user);
    }

    write() {
        writeJSON(path.resolve(this.repository, USERJSON), this);
    }
}
