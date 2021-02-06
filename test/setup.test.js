import {vol, fs} from 'memfs';
import {patchFs} from 'fs-monkey';

export const UtilsFilesJSONTestDir = {
    repositoryDir: "/utils/files/json/repo",
    nonRepositoryDir: "/utils/files/json/non-repo",
}

export const UtilsFilesRepositoryTestDir = {
    repositoryDir: "/utils/files/repository/repo",
    nonRepositoryDir: "/utils/files/repository/non-repo",
}

export const testDirectories = [
    UtilsFilesJSONTestDir.repositoryDir,
    UtilsFilesJSONTestDir.nonRepositoryDir,
    UtilsFilesRepositoryTestDir.repositoryDir,
    UtilsFilesRepositoryTestDir.nonRepositoryDir,
]

before(() => {
    testDirectories.forEach(directory => {
        vol.mkdirSync(directory, {recursive: true})
    })
    patchFs(vol);
})
