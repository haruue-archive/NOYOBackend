import {parseBoolean} from "../util/request-utils";
import * as assert from "assert";

describe('request-utils', () => {
  describe('parseBoolean', () => {
    it('1. should be itself when parse a boolean value true', () => { assert.equal(parseBoolean(true), true) });
    it('2. should be itself when parse a boolean value false', () => { assert.equal(parseBoolean(false), false) });
    it('3. should be default value when parse a null', () => { assert.equal(parseBoolean(null), false) });
    it('4. should be default value when parse a null', () => { assert.equal(parseBoolean(null, true), true) });
    it('5. should be default value when parse a undefined', () => { assert.equal(parseBoolean(undefined), false) });
    it('6. should be default value when parse a undefined', () => { assert.equal(parseBoolean(undefined, true), true) });
    it('7. should be default value when parse a empty string', () => { assert.equal(parseBoolean(''), false) });
    it('8. should be default value when parse a random string', () => { assert.equal(parseBoolean('abc'), false) });
    it('9. should be always true when parse a yes', () => { assert.equal(parseBoolean('yes'), true) });
    it('10. should be always true when parse a yes', () => { assert.equal(parseBoolean('yes', true), true) });
    it('11. should be always false when parse a no', () => { assert.equal(parseBoolean('no'), false) });
    it('12. should be always false when parse a no', () => { assert.equal(parseBoolean('no', true), false) });
    it('13. should be always true when parse a non-zero number', () => { assert.equal(parseBoolean(200), true) });
    it('14. should be always true when parse a non-zero number', () => { assert.equal(parseBoolean(200, true), true) });
    it('15. should be always false when parse a zero number', () => { assert.equal(parseBoolean(0), false) });
    it('16. should be always false when parse a zero number', () => { assert.equal(parseBoolean(0, true), false) });
    it('17. should be always true when parse a "true"', () => { assert.equal(parseBoolean('true'), true) });
    it('18. should be always true when parse a "true"', () => { assert.equal(parseBoolean('true', true), true) });
    it('19. should be always false when parse a "false"', () => { assert.equal(parseBoolean('false'), false) });
    it('20. should be always false when parse a "false"', () => { assert.equal(parseBoolean('false', true), false) });
  })
});

