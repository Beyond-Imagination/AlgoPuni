import fs from 'fs';
import path from 'path';

import {USERJSON} from '../../params';

export const GITIGNORE = ".gitignore"

export const createGitIgnore = (repository) => {
    const content = `${USERJSON}`;
    fs.writeFileSync(path.resolve(repository, GITIGNORE), content);
}
