import fs from 'fs';
import path from 'path';
import jsonfile from 'jsonfile';

import {DATAJSON, USERJSON} from '../../params';
import {findRepository} from './repository';

const readFile = (path, option) => {
    return jsonfile.readFileSync(path, option)
}

const writeFile = (path, obj, option) => {
    option = {
        ...option,
        spaces: 4, 
        EOL: '\r\n'
    }
    jsonfile.writeFileSync(path, obj, option);
}

export const readDataJson = (repository=findRepository()) => {
    return readFile(path.resolve(repository, DATAJSON))
}

export const writeDataJson = (obj, repository=findRepository()) => {
    writeFile(path.resolve(repository, DATAJSON), obj);
}

export const createDataJson = (repository=findRepository()) => {
    if (fs.existsSync(path.resolve(repository, DATAJSON))) {
        return;
    }
    let obj = {
        users: {},
        problems: {
            challenging: [],
            archived: [],
            this_week: []
        }
    }
    writeDataJson(obj, repository);
}

export const readUserJson = (repository=findRepository()) => {
    return readFile(path.resolve(repository, USERJSON))
}

export const writeUserJson = (obj, repository=findRepository()) => {
    writeFile(path.resolve(repository, USERJSON), obj);
}

export const createUserJson = (repository=findRepository()) => {
    let id = "name" // TODO get user id from prompt
    let obj = {
        user_id: id,
        current_problem: 0
    }
    writeUserJson(obj, repository);
}
