import fs from 'fs';
import path from 'path';

import {ALGOPUNIDIR} from '../../params';
import {ErrorNoRepositoryFound, ErrorRepositoryExist} from '../error';

export const isRepository = (dir) => {
    return fs.existsSync(path.resolve(dir, ALGOPUNIDIR))
}

export const findRepository = (dir = process.cwd()) => {
    const rootDir = path.parse(process.cwd()).root;

    while(true) {
        if (isRepository(dir)) {
            return dir;
        }
        
        if(rootDir === dir){
            throw ErrorNoRepositoryFound;
        } else {
            dir = path.resolve(dir, "..");
        }
    }
}

export const createRepository = (dir = process.cwd()) => {
    if(isRepository(dir)) {
        throw ErrorRepositoryExist;
    }

    fs.mkdirSync(path.resolve(dir, ALGOPUNIDIR));
}
