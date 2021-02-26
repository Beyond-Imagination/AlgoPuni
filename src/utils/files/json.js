import fs from 'fs';

import {ErrorReadFile, ErrorWriteFile} from '../error';
import log from '../log';

export const readJSON = (file) => {
    try {
        log.debug("readJSON", file);
        const jsonString = fs.readFileSync(file)
        return JSON.parse(jsonString)
    } catch (error) {
        log.debug("error:readJSON", error);
        throw ErrorReadFile.setMessage(file);
    }
}

export const writeJSON = (file, obj) => {
    try {
        log.debug("writeJSON", "file:", file, "obj", obj);
        const jsonString = JSON.stringify(obj, null, 4)
        fs.writeFileSync(file, jsonString)
    } catch (error) {
        log.debug("error:writeJSON", error);
        throw ErrorWriteFile.setMessage(error.message);
    }
}
