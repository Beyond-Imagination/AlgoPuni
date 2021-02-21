import path from 'path';
import chai from 'chai';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {createGitIgnore, GITIGNORE} from '../../../src/utils/files/gitignore';

const repositoryDir = path.resolve("/","utils","files","repository","repo");

let assert = chai.assert;

describe("gitignore", () => {
    before(() => {
        vol.mkdirSync(repositoryDir, {recursive: true})
        patchFs(vol);
    })

    it("CreateGitIgnore", () => {
        createGitIgnore(repositoryDir);
        let gitignore = fs.readFileSync(path.resolve(repositoryDir, GITIGNORE))
        assert.equal(gitignore, ".algopuni/user.json")
    })
})
