import chai from 'chai';

import {Context} from '../../../src/lib/context';

let assert = chai.assert;

describe("context", () => {
    it("constructor", () => {
        const context = new Context(".");
        assert.equal(".", context.repository);
        assert.isObject(context.data);
        assert.isObject(context.user);
    })
})
