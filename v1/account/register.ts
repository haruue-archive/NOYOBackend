import {Request, Response, Router} from "express";
import {errorHandle} from "../../util/error-handler";
import {checkPasswordStrength, hashPassword} from "../../util/password";
import {mongo} from "../../util/database";
import {Member} from "../../model/member";
import {successHandle} from "../../util/success-handler";

export let router = Router();

async function register(req: Request, res: Response) {
  let mobile = parseInt(req.body["mobile"]);
  if (!Number.isInteger(mobile)) {
    errorHandle(null, 'mobile number malformed', 400, res);
    return;
  }
  let password = req.body["password"];
  let passwordStrength = await checkPasswordStrength(password);
  if (!passwordStrength.result) {
    if (!passwordStrength.message) {
      throw new Error("You should provide reason message if password strength check error");
    }
    errorHandle(null, passwordStrength.message, 400 , res);
    return;
  }
  let member = new Member();
  member.mobile = mobile;
  member.password = await hashPassword(password);
  try {
    let db = await mongo();
    let old = await db.member.findOne({'mobile': mobile});
    if (old) {
      errorHandle(null, 'mobile registered, try find password instead', 400, res);
      return;
    }
    let result = await db.member.insertOne(member);
    member._id = result.insertedId;
  } catch (err) {
    errorHandle(err, 'unexpected error in database operation', 500, res);
    return;
  }
  successHandle('register success', member, res);
}

router.post('/', register);

