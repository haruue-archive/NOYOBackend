import {Request, Response, Router} from "express";
import {errorHandle} from "../../util/error-handler";
import {mongo} from "../../util/database";
import {checkPassword} from "../../util/password";
import {successHandle} from "../../util/success-handler";

export let router = Router();

async function login(req: Request, res: Response) {
  let username = req.body['username'];
  if (!username) {
    errorHandle(null, "username is empty", 400, res);
    return;
  }
  let password = req.body["password"];
  if (!password) {
    errorHandle(null, "password is empty", 400, res);
    return;
  }
  try {
    let db = await mongo();
    let result = await db.member.findOne({'$or': [
      {'username': username},
      {'mobile':parseInt(username)},
      {'email':username}
    ]});
    if (!result) {
      errorHandle(null, `account not exist`, 400, res);
      return;
    }
    if (!result.password) {
      errorHandle(`[info] password not exist for user ${result.username}`, 'account has been disabled', 400, res);
      return;
    }
    if (await checkPassword(password, result.password as string)) {
      successHandle('login success', result, res);
      return;
    }
  } catch (err) {
    errorHandle(err, 'unexpected error in database operation', 500, res);
    return;
  }
}

router.post('/', login);
