import fs from 'fs';
import path from 'path';

import {DATAJSON} from '../../params';
import {findRepository} from '../files/repository';
import {readJSON, writeJSON} from '../files/json';

export class Data {
    constructor(repository=findRepository()) {
        this.repository = repository;
    }

    create() {
        if (fs.existsSync(path.resolve(this.repository, DATAJSON))) {
            return;
        }
        this.users = {};
        this.problems = {
            challenging: [],
            archived: [],
            thisWeek: []
        };
        this.write();
        return this;
    }

    read() {
        const data = readJSON(path.resolve(this.repository, DATAJSON));
        Object.assign(this, data);
    }

    write() {
        writeJSON(path.resolve(this.repository, DATAJSON), this);
    }

    addUser(user) {
        this.users[user.userID] = user;
        this.write();
    }
}
