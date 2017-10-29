import {Request, Response, Router} from "express";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {checkPasswordStrength, hashPassword} from "../../util/password";
import {mongo} from "../../util/database";
import {Member} from "../../model/member";
import {successHandle} from "../../util/success-handler";

/**
 * Register API
 *
 * @param mobile
 * @param password
 * @return {@link Member} if success
 */

export let router = Router();

async function register(req: Request, res: Response) {
  let mobile = parseInt(req.body["mobile"]);
  if (!Number.isInteger(mobile)) {
    errorHandle(res, 400, APIErrorList.mobileMalformed);
    return;
  }
  let password = req.body["password"];
  let passwordStrength = await checkPasswordStrength(password);
  if (!passwordStrength.result) {
    if (!passwordStrength.info) {
      throw new Error("You should provide reason info if password strength check error");
    }
    errorHandle(res, 400, passwordStrength.info);
    return;
  }
  let member = new Member();
  member.mobile = mobile;
  member.password = await hashPassword(password);
  try {
    let db = await mongo();
    let old = await db.member.findOne({'mobile': mobile});
    if (old) {
      errorHandle(res, 400, APIErrorList.mobileUsed);
      return;
    }
    let result = await db.member.insertOne(member);
    member._id = result.insertedId;
  } catch (err) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError);
    return;
  }
  successHandle(res, {message: 'register success', data: member});
}

router.post('/', register);

