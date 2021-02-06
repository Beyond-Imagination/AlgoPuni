import path from 'path';
import chai from 'chai';
import {fs} from 'memfs';

import {ALGOPUNIDIR} from '../../../params';
import {createRepository, isRepository, findRepository} from '../../../utils/files/repository';
import {UtilsFilesRepositoryTestDir} from "../../setup.test";

const {repositoryDir, nonRepositoryDir} = UtilsFilesRepositoryTestDir;

let assert = chai.assert;

describe("Repository", () => {
    it("CreateRepository", () => {
        createRepository(repositoryDir);
        let isExist = fs.existsSync(path.resolve(repositoryDir, ALGOPUNIDIR))
        assert.equal(isExist, true, "fail to create repository")
    })

    it("Fail CreateRepository on Algopuni repository directory", () => {
        assert.throws(() => createRepository(repositoryDir), "current working directory is already an AlgoPuni repository", "should fail creating respotiroy on Algopuni repository directory")
    })

    it("IsRepository", () => {
        let isRepo = isRepository(repositoryDir)
        assert.equal(isRepo, true, "should return true on Algopuni repostiroy directory")
    })

    it("Fail IsRepository", () => {
        let isRepo = isRepository(nonRepositoryDir)
        assert.equal(isRepo, false, "should return false on not Algopuni repostiroy directory")
    })

    it("FindRepository", () => {
        let dir = `${repositoryDir}/1/2/3/4/5`
        fs.mkdirSync(dir, {recursive:true})
        for(let i=0; i<5; i++) {
            let result = findRepository(dir)
            assert.equal(result, repositoryDir, "should find repository")
            dir = path.resolve(dir, "..");
        }
    })

    it("Fail FindRepository", () => {
        assert.throws(() => findRepository(nonRepositoryDir), "no AlgoPuni repository found", "should fail finding repository");
    })
})
