import fs from 'fs';
import path from 'path';

import {USERJSON} from '../../params';
import {findRepository} from '../files/repository';
import {readJSON, writeJSON} from '../files/json';

export const readUserJSON = (repository=findRepository()) => {
    return readJSON(path.resolve(repository, USERJSON))
}

export const writeUserJSON = (user, repository=findRepository()) => {
    writeJSON(path.resolve(repository, USERJSON), user);
}

export const createUserJSON = (repository=findRepository()) => {
    let user = askUserInfo();
    writeUserJSON(user, repository);
    return user;
}

const askUserInfo = () => {
    let id = "name" // TODO get user id from prompt
    let user = {
        user_id: id,
        current_problem: 0,
        challenging: [],
    }
    return user;
}
