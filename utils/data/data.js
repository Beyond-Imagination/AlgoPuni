import fs from 'fs';
import path from 'path';

import {DATAJSON} from '../../params';
import {findRepository} from '../files/repository';
import {readJSON, writeJSON} from '../files/json';

export const readDataJSON = (repository=findRepository()) => {
    return readJSON(path.resolve(repository, DATAJSON))
}

export const writeDataJSON = (data, repository=findRepository()) => {
    writeJSON(path.resolve(repository, DATAJSON), data);
}

export const createDataJSON = (repository=findRepository()) => {
    if (fs.existsSync(path.resolve(repository, DATAJSON))) {
        return;
    }
    let data = {
        users: {},
        problems: {
            challenging: [],
            archived: [],
            this_week: []
        }
    }
    writeDataJSON(data, repository);
    return data;
}
