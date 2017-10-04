import {compare, hash} from 'bcrypt';
import {APIError, APIErrorList} from "./error-handler";

export function checkPasswordStrength(password: string): Promise<{result: boolean, info?: APIError}> {
  return new Promise((resolve, reject) => {
    if (!password) {
      resolve({result: false, info: APIErrorList.passwordEmpty});
      return;
    }
    if (password.length < 6) {
      resolve({result: false, info: APIErrorList.passwordTooShort});
      return;
    }
    if (password.length > 32) {
      resolve({result: false, info: APIErrorList.passwordTooLong});
      return;
    }
    let vote = 0;
    let regs = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];
    for (let reg of regs) {
      if (password.match(reg)) {
        vote++;
      }
    }
    if (vote < 3) {
      resolve({result: false, info: APIErrorList[`passwordWeak-${vote}`]});
      return;
    }
    resolve({result: true});
  });
}

export function hashPassword(password: string): Promise<string> {
  return hash(password, 6);
}

export function checkPassword(passowrd: string, hash: string): Promise<boolean> {
  return compare(passowrd, hash);
}