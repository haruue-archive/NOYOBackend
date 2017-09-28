import {checkPassword, checkPasswordStrength, hashPassword} from "../util/password";

const passwords = [
  '',
  '123',
  '123456',
  'abc123',
  'Abc123',
  'abc1@3',
  'P@55W0Rd',
  '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
];

const password = 'P@55W0Rd-1234567890';

async function testCheckPasswordStrength() {
  for (let password of passwords) {
    console.log(password, await checkPasswordStrength(password));
  }
}

async function testCheckPassword() {
  const hash = await hashPassword(password);
  const anotherPassword = 'Password-abc-123';
  const originCheck = await checkPassword(password, hash);
  const anotherCheck = await checkPassword(anotherPassword, hash);
  console.log(`${password} <${originCheck}> ${hash}`);
  console.log(`${anotherPassword} <${anotherCheck}> ${hash}`);
}

testCheckPasswordStrength();
testCheckPassword();
