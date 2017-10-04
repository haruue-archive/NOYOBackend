import {Request, Response, Router} from "express";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {mongo} from "../../util/database";
import {checkPassword} from "../../util/password";
import {successHandle} from "../../util/success-handler";
import {parseBoolean} from "../../util/request-utils";

export let router = Router();

async function login(req: Request, res: Response) {
  let username = req.body['username'];
  if (!username) {
    res.clearCookie('uid');
    errorHandle(res, 400, APIErrorList.usernameEmpty);
    return;
  }
  let password = req.body["password"];
  if (!password) {
    res.clearCookie('uid');
    errorHandle(res, 400, APIErrorList.passwordEmpty);
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
      errorHandle(res, 400, APIErrorList.accountNotExist);
      return;
    }
    if (!result.password) {
      res.clearCookie('uid');
      errorHandle(res, 400, APIErrorList.accountDisabled, `[info] password not exist for user ${result.username}`);
      return;
    }
    if (await checkPassword(password, result.password as string)) {
      let expires = persist ? new Date(Date.now() + 31536000000 /*365 days*/) : undefined;
      res.cookie('uid', result._id, {expires: expires, signed: true});
      successHandle(res, {message: 'login success', data: result});
      return;
    } else {
      res.clearCookie('uid');
      errorHandle(res, 400, APIErrorList.passwordError);
      return;
    }
  } catch (err) {
    res.clearCookie('uid');
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, err);
    return;
  }
}

router.post('/', login);
