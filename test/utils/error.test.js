import chai from 'chai';
import sinon from 'sinon';

import log from '../../src/utils/log';
import {errorHandler, createFormatError, ErrorReadFile, ErrorWriteFile, ErrorUnknown} from '../../src/utils/error';

let assert = chai.assert;

describe("error", () => {
    const needRestore = [];
    afterEach(() => {
        while(needRestore.length) {
            let obj = needRestore.pop();
            obj.restore();
        }
    })

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

    it("error handler with known error", () => {
        let logStub = sinon.stub(log, 'error');
        let processStub =sinon.stub(process, 'exit');
        needRestore.push(logStub, processStub);

        errorHandler(ErrorReadFile);
        assert.isTrue(logStub.calledOnceWith(ErrorReadFile.message));
        assert.isTrue(processStub.calledOnceWith(ErrorReadFile.code));
    })

    it("error handler with unknown error", () => {
        let logStub = sinon.stub(log, 'error');
        let processStub =sinon.stub(process, 'exit');
        needRestore.push(logStub, processStub);

        errorHandler(new Error("unknown error for test"));
        assert.isTrue(logStub.calledOnceWith(ErrorUnknown.message));
        assert.isTrue(processStub.calledOnceWith(ErrorUnknown.code));
    })
})
