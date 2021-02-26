import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

import {USERJSON} from '../../../src/params';
import {createRepository} from '../../../src/utils/files/repository'
import {ErrorExistUserID} from '../../../src/utils/error';
import Context from '../../../src/lib/context'
import Data from '../../../src/lib/context/data'
import User from '../../../src/lib/context/user'
import add from'../../../src/commands/user/add'

const repositoryDir1 = path.resolve("/","commands","user","add","repo1");
const repositoryDir2 = path.resolve("/","commands","user","add","repo2");
const nonRepositoryDir = path.resolve("/","commands","user","add","non-repo");

const assert = chai.assert;

describe("command user add", ()=>{
    before(()=>{
        vol.mkdirSync(repositoryDir1, {recursive: true});
        vol.mkdirSync(repositoryDir2, {recursive: true});
        vol.mkdirSync(nonRepositoryDir, {recursive: true});
        patchFs(vol);

        createRepository(repositoryDir1);
        let data = new Data(repositoryDir1);
        data.write();

        createRepository(repositoryDir2);
        data = new Data(repositoryDir2);
        data.write();
    });
    
    const needRestore = []
    afterEach(() => {
        while(needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    })

    it("success add without argument", async ()=>{
        const userID = faker.name.firstName();

        const cwd = sinon.stub(process, 'cwd').returns(repositoryDir1)
        needRestore.push(cwd)
        const userStub = sinon.stub(User.prototype, 'askUserID').returns(userID)
        needRestore.push(userStub)

        const isExist = fs.existsSync(path.resolve(repositoryDir1, USERJSON))
        assert.isFalse(isExist);

        await add.parseAsync(['node', 'test']);

        const context = new Context(repositoryDir1);
        context.read();

        assert.equal(userID, context.user.userID);
        assert.isObject(context.data.users[userID]);
    });

    it("success add with argument", async ()=>{
        const userID = faker.name.firstName();

        const cwd = sinon.stub(process, 'cwd').returns(repositoryDir2)
        needRestore.push(cwd)

        const isExist = fs.existsSync(path.resolve(repositoryDir2, USERJSON))
        assert.isFalse(isExist);

        await add.parseAsync(['node', 'test', userID]);

        const context = new Context(repositoryDir2);
        context.read();

        assert.equal(userID, context.user.userID);
        assert.isObject(context.data.users[userID]);
    });

    it("fail add with same id", async ()=>{
        const userID = faker.name.firstName();

        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir2)
        const exitStub = sinon.stub(process, 'exit')
        needRestore.push(cwdStub, exitStub)

        const isExist = fs.existsSync(path.resolve(repositoryDir2, USERJSON))
        assert.isTrue(isExist);

        await add.parseAsync(['node', 'test', userID]);
        exitStub.calledOnceWith(ErrorExistUserID.code);
    });
});
