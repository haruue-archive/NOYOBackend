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
};