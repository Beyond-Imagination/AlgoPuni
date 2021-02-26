import util from 'util';

const createError = (code, message) => {
    let err = new Error(message);
    err.code = code;
    return err;
}

export const createFormatError = (code, messageFormat) => {
    let err = new Error(messageFormat);
    err.code = code;
    err.setMessage = (...rest) => {
        err.message = util.format(messageFormat, ...rest);
        return err;
    }
    return err;
}

// 10~19 repository error
export const ErrorRepositoryExist = createError(10, '알고푸니 프로젝트가 이미 존재합니다.')
export const ErrorNoRepositoryFound = createError(11, '알고푸니 프로젝트를 찾을 수 없습니다.');

// 20~29 user inforemation error
export const ErrorExistUserID = createError(20, '이미 존재하는 ID 입니다.');
export const ErrorSameUserIDAsBefore = createError(21, '바꾸고자 하는 ID가 기존과 동일합니다.');

// 30~39 file error
export const ErrorReadFile = createFormatError(30, '파일을 찾을 수 없습니다. 경로 : %s');
export const ErrorWriteFile = createFormatError(31, '파일 저장에 실패했습니다. 에러 : %s');

// 40~49 problem information error

// 50~59 crawling error
export const ErrorNoProgrammersAccount = createError(40, '프로그래머스 계정 정보가 필요합니다.');
export const ErrorFailCrawlProblem = createError(41, '문제 정보를 가져올 수 없습니다.');
