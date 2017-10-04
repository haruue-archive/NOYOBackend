import {checkPassword, checkPasswordStrength, hashPassword} from "../util/password";
import * as assert from "assert";

describe('password', async () => {
  describe('strength', async () => {
    const passwords = {
      '': {expect: false, type: 'empty'},
      '123': {expect: false, type: 'short'},
      '123456': {expect: false, type: 'weak'},
      'abc123': {expect: false, type: 'weak'},
      'Abc123': {expect: true, type: 'good'},
      'abc1@3': {expect: true, type: 'good'},
      'P@55W0Rd': {expect: true, type: 'good'},
      '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000': {expect: false, type: 'long'}
    };
    for (let p in passwords) {
      let info = passwords[p] as {expect: boolean, type: string};
      it(`${info.type} password '${p}'`, async () => {
        assert.equal((await checkPasswordStrength(p)).result, info.expect);
      })
    }
  });
  describe('check', async () => {
    const password = 'P@55W0Rd-1234567890';
    const hash = await hashPassword(password);
    const anotherPassword = 'Password-abc-123';
    it('right password', async () => {
      assert.equal(await checkPassword(password, hash), true);
    });
    it('error password', async () => {
      assert.equal(await checkPassword(anotherPassword, hash), false);
    })
  })
});

