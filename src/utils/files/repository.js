import fs from 'fs';
import path from 'path';

import {ALGOPUNIDIR} from '../../params';

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
            throw new Error('no AlgoPuni repository found');
        } else {
            dir = path.resolve(dir, "..");
        }
    }
}

export const createRepository = (dir = process.cwd()) => {
    if(isRepository(dir)) {
        throw new Error('current working directory is already an AlgoPuni repository');
    }

    fs.mkdirSync(path.resolve(dir, ALGOPUNIDIR));
}
