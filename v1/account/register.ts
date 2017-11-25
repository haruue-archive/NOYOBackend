import {Request, Response, Router} from "express";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {checkPasswordStrength, hashPassword} from "../../util/password";
import {mongo} from "../../util/database";
import {Member} from "../../model/member";
import {successHandle} from "../../util/success-handler";
import {Db} from "mongodb";
import {isEmailValidate} from "../../util/request-utils";

/**
 * Register API
 *
 * @param email
 * @param username
 * @param nickname
 * @param password
 * @param role
 * @return {@link Member} if success
 */

export let router = Router();

async function register(req: Request, res: Response) {
  let email = req.body.email;
  let username = req.body.username;
  let nickname = req.body.nickname;
  let password = req.body.password;
  let role = req.body.role;

  if (!email || !username || !nickname || !password || !role) {
    errorHandle(res, 400, APIErrorList.informationNotComplete);
    return;
  }

  if (Member.ROLES.indexOf(role) < 0) {
    errorHandle(res, 400, APIErrorList.roleNotExist);
    return;
  }

  if (!isEmailValidate(email)) {
    errorHandle(res, 400, APIErrorList.emailMalformed);
    return;
  }

  if (!/^[a-zA-Z_][a-zA-Z0-9_]{4,}$/.test(username)) {
    errorHandle(res, 400, APIErrorList.usernameMalformed);
    return;
  }

  let passwordStrength = await checkPasswordStrength(password);
  if (!passwordStrength.result) {
    if (!passwordStrength.info) {
      throw new Error("You should provide reason info if password strength check error");
    }
    errorHandle(res, 400, passwordStrength.info);
    return;
  }

  let member = new Member();
  member.email = email;
  member.username = username;
  member.nickname = nickname;
  member.password = await hashPassword(password);
  member.role = role;
  try {
    let db = await mongo();

    let old = await db.member.findOne({'username': new RegExp(`^${username}$`, 'i')});
    if (old) {
      errorHandle(res, 400, APIErrorList.usernameUsed);
      return;
    }

    old = await db.member.findOne({'email': email});
    if (old) {
      errorHandle(res, 400, APIErrorList.emailUsed);
      return;
    }

    let result = await db.member.insertOne(member);
    member._id = result.insertedId;
    successHandle(res, {message: 'register success', data: member});
    return;
  } catch (err) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError);
    return;
  }
}

router.post('/', register);

