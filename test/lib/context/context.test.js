import chai from 'chai';
import sinon from 'sinon';
import path from 'path';
import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';
import faker from 'faker';

import {DATAJSON, USERJSON} from '../../../src/params';
import {GITIGNORE} from '../../../src/utils/files/gitignore';
import {createRepository} from '../../../src/utils/files/repository';
import Context from '../../../src/lib/context';

const repositoryDir = path.resolve("/","lib","context","repo");
const nonRepositoryDir = path.resolve("/","lib","context","non-repo");

let assert = chai.assert;

const userID = faker.name.firstName();
const currentProblem = faker.random.number();
const challenging = Array.from(Array(faker.random.number(5)), () => faker.random.number(10000))

describe("context", () => {
    const needRestore = []

    before(() => {
        vol.mkdirSync(repositoryDir, {recursive: true})
        vol.mkdirSync(nonRepositoryDir, {recursive: true})
        patchFs(vol);
    })

    afterEach(() => {
        while(needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    })

    it("constructor", () => {
        const context = new Context(".");
        assert.equal(".", context.repository);
        assert.isObject(context.data);
        assert.isObject(context.user);
    })

    it("success create", async () => {
        const context = new Context(repositoryDir);
        
        const user = sinon.stub(context.user, 'askUserID').returns("user")
        needRestore.push(user)

        await context.create();
        let isExist = fs.existsSync(path.resolve(repositoryDir, DATAJSON))
        assert.isTrue(isExist, "fail to create data json")
        isExist = fs.existsSync(path.resolve(repositoryDir, USERJSON))
        assert.isTrue(isExist, "fail to create user json")
        isExist = fs.existsSync(path.resolve(repositoryDir, GITIGNORE))
        assert.isTrue(isExist, "fail to create gitignore")
    })

    it("fail create", () => {
        const context = new Context(repositoryDir);
        const user = sinon.stub(context.user, 'askUserID').returns("user")
        needRestore.push(user)

        context.create()
            .then(()=>{
                throw new Error("test fail")
            })
            .catch((err)=>{
                // test success. should throw err
            })
    })

    it("success write", () => {
        const context = new Context(repositoryDir);
        context.user.userID = userID;
        context.user.currentProblem = currentProblem;
        context.user.challenging = challenging;
        context.data.problems.challenging = challenging;
        context.write();

        let result = JSON.parse(fs.readFileSync(path.resolve(repositoryDir, DATAJSON)))
        assert.deepEqual(result, context.data.toJSON())

        result = JSON.parse(fs.readFileSync(path.resolve(repositoryDir, USERJSON)))
        assert.deepEqual(result, context.user.toJSON())
    })

    it("fail write", () => {
        const context = new Context(nonRepositoryDir);
        assert.throw(()=> context.write())
    })

    it("success read", () => {
        const context = new Context(repositoryDir);
        context.read();

        let result = JSON.parse(fs.readFileSync(path.resolve(repositoryDir, DATAJSON)))
        assert.deepEqual(result.users, context.data.users);
        assert.deepEqual(result.problems, context.data.problems);

        result = JSON.parse(fs.readFileSync(path.resolve(repositoryDir, USERJSON)))
        assert.deepEqual(result.userID, context.user.userID);
        assert.deepEqual(result.currentProblem, context.user.currentProblem);
        assert.deepEqual(result.challenging, context.user.challenging);
    })
    
    it("fail read", () => {
        const context = new Context(nonRepositoryDir);
        assert.throw(()=> context.read())
    })
})
