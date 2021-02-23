import fs from 'fs';
import path from 'path';

import {USERJSON} from '../../params';

export const GITIGNORE = ".gitignore"

export const createGitIgnore = (repository) => {
    if(fs.existsSync(path.resolve(repository, GITIGNORE))){
        return;
    }
    const content = `${USERJSON}`;
    fs.writeFileSync(path.resolve(repository, GITIGNORE), content);
}
