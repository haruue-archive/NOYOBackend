import {Response} from "express";
import {isUndefined} from "util";

export interface APIError {
  message: string;
  errno: number;
  status?: string;
}

export function errorHandle(res: Response, code: number, info: APIError, error: any = null) {
  error && console.error(error);
  if (res) {
    code && res.status && res.status(code);
    if (isUndefined(info.status)) {
      info.status = 'error';
    }
    res.send(info);
  }
}

export const APIErrorList = {
  // 1. register
  "mobileMalformed": {message: 'mobile is malformed', errno: 10001},
  "mobileUsed": {message: 'mobile registered, try find password instead', errno: 10002},
  "emailMalformed": {message: 'email is malformed', errno: 10003},
  "emailUsed": {message: 'email registered, try find password instead', errno: 10004},
  "roleNotExist": {message: 'role should be farmer or consumer', errno: 10005},
  "usernameUsed": {message: 'username is used, please try another one', errno: 10006},
  "usernameMalformed": {message: 'username should be in 5 or more letters or numbers and should not start by a number', errno: 10007},
  // 2. password
  "passwordEmpty": {message: 'password is empty', errno: 20001},
  "passwordTooShort": {message: 'password is too short', errno: 20002},
  "passwordTooLong": {message: 'password is too long', errno: 20003},
  "passwordWeak-1": {message: 'password is too weak. Password must include 3 of lower cases, upper cases, numeric and other symbols. But you only include 1', errno: 20011},
  "passwordWeak-2": {message: 'password is too weak. Password must include 3 of lower cases, upper cases, numeric and other symbols. But you only include 2', errno: 20012},
  // 3. database
  "unexpectedDatabaseError": {message: 'unexpected error in database operation', errno: 30000},
  // 4. login
  "usernameEmpty": {message: 'username is empty', errno: 40001},
  "accountNotExist": {message: 'account is not exist', errno: 40002},
  "accountDisabled": {message: 'account is disabled', errno: 40003},
  "passwordError": {message: 'password is error', errno: 40004},
  // 5. account global
  "authorizationRequired": {message: 'Authorization Required', errno: 50000},
  "informationNotComplete": {message: 'need more parameter, please see api doc for detail', errno: 50001},
  "unknownWhatToVerify": {message: '`what` only can be \'mobile\' or \'email\'', errno: 50002},
  "noSuchUid": {message: 'no such uid', errno: 50003},
  "noMobile": {message: 'this user have not set a mobile', errno: 50004},
  "noEmail": {message: 'this user have not set a email', errno: 50005},
  "invalidOp": {message: 'no such op', errno: 50006},
  "failedSendMail": {message: 'failed to send mail', errno: 50007},
  "failedSendSMS": {message: 'failed to send SMS', errno: 50008},
  "invalidWhat": {message: 'no such what', errno: 50009},
  "unexpectedVerifyCheckError": {message: 'unexpected verify check error, please send a email to support', errno: 50010},
  "verifyFailed": {message: 'verify failed, please retry or maybe you has been verified.', errno: 50011},
  "emailHasVerified": {message: 'your email has been verified, don\'t need to verified again.', errno: 50012},
  "mobileHasVerified": {message: 'your email has been verified, don\'t need to verified again.', errno: 50013},
  "unsupportedOpWithWhat": {message: 'this `op` don\'t support this `what`', errno: 50014},
  // 8. goods
  "errorType": {message: '`type` must be one of \'mud\' or \'product\'', errno: 80001},
  "permissionDeniedModifyGoods": {message: 'only farmers can operate goods', errno: 80002},
  "noSuchGoods": {message: 'can not find such goods', errno: 80003},
  "negativeValue": {message: 'value can not be a negative', errno: 80004},
  "noSuchGoodsQueryField": {message: 'can\'t query by this', errno: 80005},
  // 9. order
  "permissionDeniedModifyOrder": {message: 'only consumer can operate order', errno: 90000},
  "noSuchOrder": {message: 'no such order', errno: 90001},
  "errorOrderStatus": {message: 'only order in STATUS_WAITING_PAY or STATUS_PAID can be cancel', errno: 90002},
};