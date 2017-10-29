import {Request, Response, Router} from "express";
import {checkLoginUser} from "../../util/password";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {mongo} from "../../util/database";
import {successHandle} from "../../util/success-handler";

/**
 * Add car API
 * @param carNum
 * @param (in cookie) signatureCookie['uid']
 * @return {@link Member} if success
 */

export let router = Router();

async function add(req: Request, res: Response) {
  let member = await checkLoginUser(req, res);
  if (!member) {
    return;
  }
  let carNum = req.body['carNum'];
  if (!carNum) {
    errorHandle(res, 400, APIErrorList.carNumberEmpty);
    return;
  }
  carNum = carNum.toUpperCase();
  if (!carNum.match(/^.[A-Z0-9]{6}$/)) {
    errorHandle(res, 400, APIErrorList.carNumberMalformed);
    return;
  }
  if (!member.cars) {
    member.cars = [];
  }
  if (carNum !in member.cars) {
    member.cars.push(carNum);
  }
  try {
    let db = await mongo();
    let result = await db.member.updateOne({'_id': member._id}, member);
    if (result.result.ok != 1) {
      errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, result);
      return;
    }
    successHandle(res, {message: 'add car success', data: member});
  } catch (e) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
  }
}

router.post('/', add);