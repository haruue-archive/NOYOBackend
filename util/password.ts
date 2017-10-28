import {compare, hash} from 'bcrypt';
import {APIError, APIErrorList, errorHandle} from "./error-handler";
import {Member} from "../model/member";
import {Request, Response} from "express";
import {mongo} from "./database";

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

export async function checkLoginUser(req: Request, res: Response): Promise<Member | null> {
  let uid = req.signedCookies['uid'];
  let member: Member | null = null;
  if (uid) {
    try {
      let db = await mongo();
      member = await db.member.findOne({'_id': uid});
    } catch (e) {
      errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
      return null;
    }
  }
  if (!member) {
    errorHandle(res, 401, APIErrorList.authorizationRequired);
  }
  return member;
}