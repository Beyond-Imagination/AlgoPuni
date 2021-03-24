import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {createRepository} from '../../../src/utils/files/repository';
import {ErrorSameUserIDAsBefore, ErrorExistUserID} from '../../../src/utils/error';
import log from '../../../src/utils/log';
import Problem from '../../../src/lib/problem';
import Context from '../../../src/lib/context';
import User from '../../../src/lib/context/user';
import update from'../../../src/commands/user/update';

const repositoryDir = path.resolve("/","commands","user","update","repo");
const nonRepositoryDir = path.resolve("/","commands","user","update","non-repo");

const unsolved = faker.random.number();
const archived = faker.random.number();
const unsovledSolutionPath = path.resolve(repositoryDir, "problems", `${unsolved}`)
const archivedSolutionPath = path.resolve(repositoryDir, "problems", "archived", `${archived}`)

const userID = faker.name.firstName();

const assert = chai.assert;
log.setLevel("debug");

describe("command user update", ()=>{
    before(()=>{
        vol.mkdirSync(repositoryDir, {recursive: true});
        patchFs(vol);
        createRepository(repositoryDir);

        vol.mkdirSync(unsovledSolutionPath, {recursive: true});
        vol.mkdirSync(archivedSolutionPath, {recursive: true});
        fs.writeFileSync(path.resolve(unsovledSolutionPath, `${userID}.js`), faker.lorem.paragraph());
        fs.writeFileSync(path.resolve(archivedSolutionPath, `${userID}.js`), faker.lorem.paragraph());

        const context = new Context(repositoryDir);
        context.user.userID = userID;
        context.data.addUser(context.user);
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

    it("fail new user id is same as original user id", ()=>{
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        needRestore.push(cwdStub, exitStub, logSpy)

        const context = new Context(repositoryDir);
        context.read();

        update.parse(['node', 'test', context.user.userID]);
        
        assert.isTrue(logSpy.calledOnceWith(ErrorSameUserIDAsBefore.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorSameUserIDAsBefore.code));
    });

    it("fail user id already exists on data.json", () => {
        const user = new User(repositoryDir);
        user.userID = faker.name.firstName();

        const context = new Context(repositoryDir);
        context.read();
        context.data.addUser(user);
        context.write();

        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir);
        const exitStub = sinon.stub(process, 'exit');
        const logSpy = sinon.spy(log, 'error');
        needRestore.push(cwdStub, exitStub, logSpy)

        update.parse(['node', 'test', user.userID]);
        
        assert.isTrue(logSpy.calledOnceWith(ErrorExistUserID.message));
        assert.isTrue(exitStub.calledOnceWith(ErrorExistUserID.code));
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
