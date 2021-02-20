import fs from 'fs';
import path from 'path';

import {DATAJSON, USERJSON} from '../../params';
import {findRepository} from './repository';

export const readJSON = (path) => {
    const jsonString = fs.readFileSync(path)
    return JSON.parse(jsonString)
}

export const writeJSON = (path, obj) => {
    const jsonString = JSON.stringify(obj, null, 4)
    fs.writeFileSync(path, jsonString)
}
