import fs from 'fs';
import path from 'path';
import prompts from 'prompts';

import { USERJSON } from '../../params';
import { findRepository } from '../../utils/files/repository';
import { readJSON, writeJSON } from '../../utils/files/json';
import {ErrorExistUserJSON} from '../../utils/error';

export default class User {
    constructor(repository = findRepository()) {
        this.repository = repository;
        this.path = path.resolve(this.repository, USERJSON);
        this.userID = "";
        this.challenging = 0;
        this.programmers = {email:"",password:""}
    }

    async create(userID) {
        if (fs.existsSync(this.path)) {
            throw ErrorExistUserJSON;
        }
        if(!userID) {
            this.userID = await this.askUserID();
        } else {
            this.userID = userID;
        }

        this.write();
    }

    async askUserID() {
        const response = await prompts({
            type: 'text',
            name: 'value',
            message: 'Input your ID'
        });
        this.userID = response.value;
        return response.value;
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
            challenging: this.challenging,
            programmers: this.programmers
        }
    }
}
