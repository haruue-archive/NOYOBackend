import {Request, Response, Router} from "express";
import {isUndefined} from "util";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {TokenGenerator} from "../../util/token-generator";
import {successHandle} from "../../util/success-handler";
import {sendMail} from "../../util/email-helper";
import {sendSMS} from "../../util/mobile-helper";
import {mongo} from "../../util/database";
import {Member} from "../../model/member";
import {mailAccount, websiteBaseUrl, websiteName} from "../../config";
import {ObjectID} from "bson";
import {MailTemplates} from "../../mail-template/index";

/**
 * handle request and verify email or mobile
 *
 * @param what (in path) what to verify, maybe 'mobile' or 'email'
 * @param uid
 * @param op
 * @param token (get only)
 */


export let router = Router();

export let OPS = {
  // key must == codeName
  verifyEmail: {codeName: "verifyEmail", humanName: "验证邮箱", whats: ["email"]},
  verifyMobile: {codeName: "verifyMobile", humanName: "验证手机号", whats: ["mobile"]}
};

function getGenerator(what: string): TokenGenerator | null {
  if (what == 'mobile') {
    return TokenGenerator.forSms();
  } else if (what == 'email') {
    return TokenGenerator.forEmail();
  } else {
    return null;
  }
}

async function request(req: Request, res: Response) {
  let what = req.params['what'];
  let uid = req.body['uid'];
  let op = req.body['op'];
  if (!what || isUndefined(uid) || !op) {
    errorHandle(res, 400, APIErrorList.informationNotComplete);
    return;
  }
  let generator = getGenerator(what);
  if (!generator) {
    errorHandle(res, 400, APIErrorList.unknownWhatToVerify);
    return;
  }
  let token = await generator.generate(uid, op);
  let member: Member | null = null;
  try {
    let db = await mongo();
    member = await db.member.findOne({'_id': new ObjectID(uid)});
  } catch (e) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
    return;
  }
  if (!member) {
    errorHandle(res, 400, APIErrorList.noSuchUid);
    return;
  }
  if (!(op in OPS)) {
    errorHandle(res, 400, APIErrorList.invalidOp);
    return;
  }
  if (OPS[op].whats.indexOf(what) < 0) {
    errorHandle(res, 400, APIErrorList.unsupportedOpWithWhat);
    return;
  }
  if (what == 'mobile') {
    let mobile = member.mobile;
    if (!mobile) {
      errorHandle(res, 400, APIErrorList.noMobile);
      return;
    }
    try {
      await sendSMS({mobile: mobile, message: `[${websiteName}] 您正在进行${OPS[op].humanName}操作，验证码是 ${token} , 有效期 15 分钟，工作人员不会询问此验证码。`});
      successHandle(res, {message: 'token sent'});
    } catch (e) {
      errorHandle(res, 500, APIErrorList.failedSendSMS, e);
      return;
    }
    return;
  }
  if (what == 'email') {
    let email = member.email;
    if (!email) {
      errorHandle(res, 400, APIErrorList.noEmail);
      return;
    }
    if (member.isEmailVerified && op == OPS.verifyEmail.codeName) {
      errorHandle(res, 400, APIErrorList.emailHasVerified);
      return;
    }
    let template = MailTemplates.findByOp(op);
    if (!template) {
      errorHandle(res, 400, APIErrorList.invalidOp);
      return;
    }
    let username = member.username;
    if (!username) {
      username = email.split('@')[0];
    }
    let subject = await template.subject();
    let text = await template.text();
    text = text.replace(/%username/g, username).replace(/%uid/g, uid).replace(/%op/g, op).replace(/%token/g, token);
    let html = await template.html();
    html = html.replace(/%username/g, username).replace(/%uid/g, uid).replace(/%op/g, op).replace(/%token/g, token);
    try {
      await sendMail({
        from: `${websiteName} <${mailAccount.auth.user}>`,
        to: `${username} <${email}>`,
        subject: subject,
        text: text,
        html: html
      });
      successHandle(res, {message: 'mail sent'});
    } catch (e) {
      errorHandle(res, 500, APIErrorList.failedSendMail, e);
      return;
    }
    return;
  }
  errorHandle(res, 400, APIErrorList.invalidWhat);
}

async function verify(req: Request, res: Response) {
  let what = req.params['what'];
  let uid = req.query['uid'];
  let op = req.query['op'];
  let token = req.query['token'];
  if (!what || isUndefined(uid) || !op || !token) {
    errorHandle(res, 400, APIErrorList.informationNotComplete);
    return;
  }
  if (what != 'email' && what != 'mobile') {
    errorHandle(res, 400, APIErrorList.invalidWhat);
  }
  if (!(op in OPS)) {
    errorHandle(res, 400, APIErrorList.invalidOp);
    return;
  }
  if (OPS[op].whats.indexOf(what) < 0) {
    errorHandle(res, 400, APIErrorList.unsupportedOpWithWhat);
    return;
  }
  let generator = getGenerator(what);
  if (!generator) {
    errorHandle(res, 400, APIErrorList.unknownWhatToVerify);
    return;
  }
  let result = false;
  try {
    result = await generator.check(uid, op, token);
  } catch (e) {
    errorHandle(res, 500, APIErrorList.unknownWhatToVerify, e);
    return;
  }
  if (!result) {
    errorHandle(res, 400, APIErrorList.verifyFailed);
    return;
  }
  if (what == 'email' && op == OPS.verifyEmail.codeName) {
    let db = await mongo();
    let member = await db.member.findOne({'_id': new ObjectID(uid)});
    if (!member) {
      errorHandle(res, 400, APIErrorList.noSuchUid);
      return;
    }
    if (!member.isEmailVerified) {
      try {
        await db.member.updateOne({'_id': member._id}, {'$set': {'isEmailVerified': true}});
        res.redirect(websiteBaseUrl + "/verifySuccess.html");
        return;
      } catch (e) {
        errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
        return;
      }
    } else {
      res.redirect(websiteBaseUrl + "/verified.html");
    }
    return;
  }
}

router.post('/:what', request);

/**
 * only handle emailVerify...
 * if you want to do anything complex, please write another API
 * and call {@link TokenGenerator.check()} manual
 *
 * @see
 */
router.get('/:what', verify);
