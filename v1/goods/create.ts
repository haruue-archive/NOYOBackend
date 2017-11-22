import {Request, Response, Router} from "express";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {isUndefined} from "util";
import {Goods} from "../../model/goods";
import {checkLoginUser} from "../../util/password";
import {Member} from "../../model/member";
import {mongo} from "../../util/database";
import {ObjectID} from "bson";
import {successHandle} from "../../util/success-handler";

/**
 * create a goods
 *
 * @param title
 * @param summary
 * @param count
 * @param price
 * @param (optional) image
 * @param type in ["mud", "product"]
 * @param address
 *
 * only farmer can create a goods
 */

export let router = Router();

async function create(req: Request, res: Response) {
  let title = req.body.title;
  let summary = req.body.summary;
  let count = parseFloat(req.body['count']);
  let price = parseFloat(req.body.price);
  let image = req.body.image;
  let type = req.body.type;
  let address = req.body.address;

  let member = await checkLoginUser(req, res);
  if (!member) {
    return;
  }

  if (member.role != Member.RoleList.ROLE_FARMER) {
    errorHandle(res, 403, APIErrorList.permissionDeniedModifyGoods);
  }

  if (!title || !summary || isUndefined(count) || !price || !type || !address) {
    errorHandle(res, 400, APIErrorList.informationNotComplete);
    return;
  }

  if (count < 0 || price < 0) {
    errorHandle(res, 400, APIErrorList.negativeValue);
    return;
  }

  if (Goods.TYPES.indexOf(type) < 0) {
    errorHandle(res, 400, APIErrorList.errorType);
    return;
  }

  let goods = new Goods(member._id as ObjectID, title, summary, count, price, type, address, image);

  try {
    let db = await mongo();
    let result = await db.goods.insertOne(goods);
    goods._id = result.insertedId;
    successHandle(res, {message: 'goods created', data: goods});
    return;
  } catch (e) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
    return;
  }
}

router.post('/', create);