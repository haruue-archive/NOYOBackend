import {Request, Response, Router} from "express";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {mongo} from "../../util/database";
import {
  checkLoginUser, checkPassword, checkPasswordStrength,
  hashPassword
} from "../../util/password";
import {successHandle} from "../../util/success-handler";
import {isEmailValidate} from "../../util/request-utils";

/**
 * update account info
 *
 * @param what (path) what to update, should be one of:
 *  + nickname
 *  + email
 *  + password
 *  + city
 *
 * @param value
 * @param old (if you need update password, please provide old password)
 *
 * only farmer who created the goods can remove it
 */

export let router = Router();

async function update(req: Request, res: Response) {
  let what = req.params.what;
  let value = req.body.value;
  let old = req.body.old;

  let member = await checkLoginUser(req, res);
  if (!member) {
    return;
  }

  if (!what) {
    errorHandle(res, 400, APIErrorList.informationNotComplete);
    return;
  }

  if (["nickname", "email", "password", "city"].indexOf(what) < 0) {
    errorHandle(res, 400, APIErrorList.invalidWhat);
    return;
  }

  if (["email", "password", "city"].indexOf(what) >= 0 && !value) {
    errorHandle(res, 400, APIErrorList.informationNotComplete);
    return;
  }

  if (what == "email" && !isEmailValidate(value)) {
    errorHandle(res, 400, APIErrorList.emailMalformed);
    return;
  }

  if (what == "password") {
    if (!old) {
      errorHandle(res, 400, APIErrorList.invalidWhat);
      return;
    }
    let strength = await checkPasswordStrength(value);
    if (!strength.result) {
      if (strength.info == null) {
        throw new Error("You should provide reason info if password strength check error");
      }
      errorHandle(res, 400, strength.info);
      return;
    }
    if (!checkPassword(old, member.password)) {
      errorHandle(res, 400, APIErrorList.passwordError);
      return;
    }

    value = await hashPassword(value);
  }

  try {
    let db = await mongo();
    member[what] = value;

    if (what == "email") {
      let old = await db.member.findOne({'email': value});
      if (old) {
        errorHandle(res, 400, APIErrorList.emailUsed)
        return;
      }
    }

    let result = await db.member.updateOne({'_id': member._id}, member);
    successHandle(res, {message: 'update success', data: member});
    return;
  } catch (e) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
    return;
  }

}

router.post('/:what', update);
