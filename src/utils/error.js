import { createFsFromVolume } from 'memfs';
import util from 'util';

import log from './log';

const errorSet = new Set();

const createError = (code, message) => {
    let err = new Error(message);
    err.code = code;
    errorSet.add(err);
    return err;
}

export const createFormatError = (code, messageFormat) => {
    let err = new Error(messageFormat);
    err.code = code;
    err.setMessage = (...rest) => {
        err.message = util.format(messageFormat, ...rest);
        return err;
    }
    errorSet.add(err);
    return err;
}

export const errorHandler = (err) => {
    if(!errorSet.has(err)){
        err = ErrorUnknown;
    }
    log.error(err.message);
    process.exit(err.code);
}

export const ErrorUnknown = createError(1, '알 수 없는 에러가 발생하였습니다.');

// 10~19 repository error
export const ErrorRepositoryExist = createError(10, '알고푸니 프로젝트가 이미 존재합니다.')
export const ErrorNoRepositoryFound = createError(11, '알고푸니 프로젝트를 찾을 수 없습니다.');

// 20~29 context error
export const ErrorExistUserID = createError(20, '이미 존재하는 ID 입니다.');
export const ErrorSameUserIDAsBefore = createError(21, '바꾸고자 하는 ID가 기존과 동일합니다.');
export const ErrorExistUserJSON = createError(22, '.algopuni/user.json이 이미 저장되어 있습니다.');
export const ErrorExistDataJSON = createError(23, '.algopuni/data.json이 이미 저장되어 있습니다.');

// 30~39 file error
export const ErrorReadFile = createFormatError(30, '파일을 찾을 수 없습니다. 경로 : %s');
export const ErrorWriteFile = createFormatError(31, '파일 저장에 실패했습니다. 에러 : %s');

// 40~49 problem information error
export const ErrorNoSelectedProblem = createError(40, '선택된 문제가 없습니다.');
export const ErrorExistProblemNumber = createError(41, '선택된 문제는 이미 저장되어있습니다');
export const ErrorTestCaseFail = createError(42, 'test case가 틀렸습니다. 틀린 부분을 확인해주세요.');

// 50~59 crawling error
export const ErrorNoProgrammersAccount = createError(50, '프로그래머스 계정 정보가 필요합니다.');
export const ErrorFailCrawlProblem = createError(51, '문제 정보를 가져올 수 없습니다.');

// 60~61 executor error
export const ErrorNoUserSolution = createFormatError(60, '%d번 문제의 작성한 코드를 찾을 수 없습니다.');
export const ErrorExecuteSolution = createError(61, '작성한 코드를 실행 할 수 없습니다.');
