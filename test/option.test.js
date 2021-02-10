import chai from 'chai';
import log from 'loglevel'

import program from '../app'

let assert = chai.assert;

describe("options", () => {
    before(() => {
        program.command("empty").action(()=>{})
    })

    it("--debug", () => {
        log.setLevel("info")
        program.parse(['node', 'test', 'empty', '--debug']);
        assert.equal(log.getLevel(), log.levels.DEBUG)
    })

    it("-d", () => {
        log.setLevel("info")
        program.parse(['node', 'test', 'empty', '-d']);
        assert.equal(log.getLevel(), log.levels.DEBUG)
    })
})
