import {compare, hash} from 'bcrypt';

export function checkPasswordStrength(password: string): Promise<{result: boolean, message?: string}> {
  return new Promise((resolve, reject) => {
    if (!password) {
      resolve({result: false, message: 'password is empty'});
    }
    if (password.length < 6) {
      resolve({result: false, message: 'password is too short'});
    }
    if (password.length > 32) {
      resolve({result: false, message: 'password is too long'});
    }
    let vote = 0;
    let regs = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];
    for (let reg of regs) {
      if (password.match(reg)) {
        vote++;
      }
    }
    if (vote < 3) {
      resolve({result: false, message: `password is too weak. Password must include 3 of lower cases, upper cases, numeric and other symbols. But you only include ${vote}`});
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