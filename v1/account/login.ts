import {Request, Response, Router} from "express";
import {errorHandle} from "../../util/error-handler";
import {mongo} from "../../util/database";
import {checkPassword} from "../../util/password";
import {successHandle} from "../../util/success-handler";
import {parseBoolean} from "../../util/request-utils";

export let router = Router();

async function login(req: Request, res: Response) {
  let username = req.body['username'];
  if (!username) {
    res.clearCookie('uid');
    errorHandle(null, "username is empty", 400, res);
    return;
  }
  let password = req.body["password"];
  if (!password) {
    res.clearCookie('uid');
    errorHandle(null, "password is empty", 400, res);
    return;
  }
  let persist = parseBoolean(req.body['persist']);
  try {
    let db = await mongo();
    let result = await db.member.findOne({'$or': [
      {'username': username},
      {'mobile':parseInt(username)},
      {'email':username}
    ]});
    if (!result) {
      res.clearCookie('uid');
      errorHandle(null, `account not exist`, 400, res);
      return;
    }
    if (!result.password) {
      res.clearCookie('uid');
      errorHandle(`[info] password not exist for user ${result.username}`, 'account has been disabled', 400, res);
      return;
    }
    if (await checkPassword(password, result.password as string)) {
      let expires = persist ? new Date(Date.now() + 31536000000 /*365 days*/) : undefined;
      res.cookie('uid', result._id, {expires: expires, signed: true});
      successHandle('login success', result, res);
      return;
    }
  } catch (err) {
    res.clearCookie('uid');
    errorHandle(err, 'unexpected error in database operation', 500, res);
    return;
  }
}

router.post('/', login);
