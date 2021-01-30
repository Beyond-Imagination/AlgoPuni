import fs from 'fs';
import path from 'path';
import error from 'commander.js-error'

import {ALGOPUNIDIR} from '../../params';

export const isRepository = (dir) => {
    return fs.existsSync(path.resolve(dir, ALGOPUNIDIR))
}

export const findRepository = () => {
    let dir = process.cwd();

    while(true) {
        if (isRepository(dir)) {
            return dir;
        }
        
        if (dir === "/") {
            error(new Error('no AlgoPuni project exist'));
        } else {
            dir = path.resolve(dir, "..");
        }
    }
}

export const createRepository = () => {
    let dir = process.cwd();
    if(isRepository(dir)) {
        error(new Error('current working directory is already an AlgoPuni repository'));
    }

    fs.mkdirSync(path.resolve(dir, ALGOPUNIDIR));
}
