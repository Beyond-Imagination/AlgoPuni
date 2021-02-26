import chai from 'chai';

import {createFormatError, ErrorReadFile, ErrorWriteFile} from '../../src/utils/error'

let assert = chai.assert;

describe("error", () => {
    it("create format error", () => {
        let err = createFormatError(1, "%s is error %s");
        err.setMessage("this", "test");
        assert.equal(err.message, "this is error test");
    })

    it("error read file", () => {
        let err = ErrorReadFile.setMessage("/file/path");
        assert.equal(err.message, "파일을 찾을 수 없습니다. 경로 : /file/path")
    })

    it("error write file", () => {
        let err = ErrorWriteFile.setMessage("unknown error");
        assert.equal(err.message, "파일 저장에 실패했습니다. 에러 : unknown error")
    })
})
