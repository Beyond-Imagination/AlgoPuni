import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

export const UtilsDataDataTestDir = {
    repositoryDir: "/utils/data/data/repo",
    nonRepositoryDir: "/utils/data/data/non-repo",
}

export const UtilsDataUserTestDir = {
    repositoryDir: "/utils/data/user/repo",
    nonRepositoryDir: "/utils/data/user/non-repo",
}

export const UtilsFilesJSONTestDir = {
    repositoryDir: "/utils/files/json/repo",
    nonRepositoryDir: "/utils/files/json/non-repo",
}

export const UtilsFilesRepositoryTestDir = {
    repositoryDir: "/utils/files/repository/repo",
    nonRepositoryDir: "/utils/files/repository/non-repo",
}

export const testDirectories = [
    UtilsDataDataTestDir,
    UtilsDataUserTestDir,
    UtilsFilesJSONTestDir,
    UtilsFilesRepositoryTestDir,
]

before(() => {
    testDirectories.forEach(directory => {
        vol.mkdirSync(directory.repositoryDir, {recursive: true})
        vol.mkdirSync(directory.nonRepositoryDir, {recursive: true})
    })
    patchFs(vol);
})
