import faker from 'faker';
import chai from 'chai';
import path from 'path';
import sinon from 'sinon';
import {vol} from 'memfs';
import {patchFs} from 'fs-monkey';

import {createRepository} from '../../../src/utils/files/repository';
import log from '../../../src/utils/log';
import Context from '../../../src/lib/context';
import programmers from'../../../src/commands/user/programmers';
import User from '../../../src/lib/context/user';


const assert = chai.assert;

describe("command user programmers", ()=>{
    before(()=>{
        patchFs(vol);
        log.setLevel('debug');
    });
    
    const needRestore = []
    afterEach(() => {
        while(needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    });

    it("sucess insert programmersInfo", async ()=>{
        const userID = faker.name.firstName();
        const repositoryDir = path.resolve("/","commands","user","programmers","repo");

        vol.mkdirSync(repositoryDir, {recursive: true});

        createRepository(repositoryDir);
        let context = new Context(repositoryDir);
        context.user.userID = userID;
        context.data.addUser(context.user);
        context.write();
        
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir);
        let accountInfo = {email : faker.internet.email(), password : faker.internet.password()};
        const askStub = sinon.stub(User.prototype,'askProgrammersAccount').returns(accountInfo);
        needRestore.push(cwdStub, askStub);
        
        await programmers.parseAsync(['node', 'test']);

        context.read();
        
        assert.deepEqual(accountInfo,context.user.programmers);
    });
    it("sucess update programmersInfo", async ()=>{
        const userID = faker.name.firstName();
        const repositoryDir = path.resolve("/","commands","user","programmers","repo1");

        vol.mkdirSync(repositoryDir, {recursive: true});

        createRepository(repositoryDir);
        let context = new Context(repositoryDir);
        context.user.userID = userID;
        context.data.addUser(context.user);
        context.user.programmers = {email : faker.internet.email(), password : faker.internet.password()};
        context.write();
        
        const cwdStub = sinon.stub(process, 'cwd').returns(repositoryDir);
        let accountInfo = {email : faker.internet.email(), password : faker.internet.password()};
        const askStub = sinon.stub(User.prototype,'askProgrammersAccount').returns(accountInfo);
        needRestore.push(cwdStub, askStub);

        assert.notDeepEqual(accountInfo,context.user.programmers);
        
        await programmers.parseAsync(['node', 'test']);

        context.read();
        
        assert.deepEqual(accountInfo,context.user.programmers);
    });

});
