import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {createRepository} from '../../../src/utils/files/repository'
import Problem from '../../../src/lib/problem'
import Context from '../../../src/lib/context'
import update from'../../../src/commands/user/update'

const repositoryDir = path.resolve("/","commands","user","update","repo");
const nonRepositoryDir = path.resolve("/","commands","user","update","non-repo");

const unsolved = faker.random.number();
const archived = faker.random.number();
const unsovledSolutionPath = path.resolve(repositoryDir, "problems", `${unsolved}`)
const archivedSolutionPath = path.resolve(repositoryDir, "problems", "archived", `${archived}`)

const userID = faker.name.firstName();

const assert = chai.assert;

describe("command user update", ()=>{
    before(()=>{
        // Make Temporary Repository
        vol.mkdirSync(repositoryDir, {recursive: true});
        patchFs(vol);
        createRepository(repositoryDir);

        vol.mkdirSync(unsovledSolutionPath, {recursive: true});
        vol.mkdirSync(archivedSolutionPath, {recursive: true});
        fs.writeFileSync(path.resolve(unsovledSolutionPath, `${userID}.js`), faker.lorem.paragraph());
        fs.writeFileSync(path.resolve(archivedSolutionPath, `${userID}.js`), faker.lorem.paragraph());

        const context = new Context(repositoryDir);
        context.user.userID = userID;
        context.data.problems.unsolved = [unsolved];
        context.data.problems.archived = [archived];
        context.write();        
    });
    
    const needRestore = []
    afterEach(() => {
        while(needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    })

    it("success update", ()=>{
        const newUserID = faker.name.firstName();
        assert.isTrue(fs.existsSync(path.resolve(unsovledSolutionPath, `${userID}.js`)));
        assert.isTrue(fs.existsSync(path.resolve(archivedSolutionPath, `${userID}.js`)));
        assert.isFalse(fs.existsSync(path.resolve(unsovledSolutionPath, `${newUserID}.js`)));
        assert.isFalse(fs.existsSync(path.resolve(archivedSolutionPath, `${newUserID}.js`)));
        const cwd = sinon.stub(process, 'cwd').returns(repositoryDir)
        needRestore.push(cwd)

        update.parse(['node', 'test', newUserID]);
        assert.isFalse(fs.existsSync(path.resolve(unsovledSolutionPath, `${userID}.js`)));
        assert.isFalse(fs.existsSync(path.resolve(archivedSolutionPath, `${userID}.js`)));
        assert.isTrue(fs.existsSync(path.resolve(unsovledSolutionPath, `${newUserID}.js`)));
        assert.isTrue(fs.existsSync(path.resolve(archivedSolutionPath, `${newUserID}.js`)));
    });
});
