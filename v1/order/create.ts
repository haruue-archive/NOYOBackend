import {Request, Response, Router} from "express";
import {checkLoginUser} from "../../util/password";
import {Member} from "../../model/member";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {mongo} from "../../util/database";
import {ObjectID} from "bson";
import {successHandle} from "../../util/success-handler";

/**
 * create a order
 *
 * @param goodsId
 * @param count
 * @param address
 * @param external
 *
 * only the consumers can list create a orders.
 *
 */

export let router = Router();

async function create(req: Request, res: Response) {
  let member = await checkLoginUser(req, res);
  if (!member) {
    return;
  }

  if (member.role != Member.RoleList.ROLE_CONSUMER) {
    errorHandle(res, 400, APIErrorList.permissionDeniedModifyOrder);
    return;
  }

  let goodsId = req.body.goodsId;
  let count = parseFloat(req.body.count);
  let address = req.body.address;
  let external = req.body.external;

  if (!goodsId || !count || !address) {
    errorHandle(res, 400, APIErrorList.informationNotComplete);
    return;
  }

  if (!external) {
    external = "";
  }

  if (count <= 0) {
    errorHandle(res, 400, APIErrorList.negativeValue);
    return;
  }

  try {
    let db = await mongo();
    let goods = await db.goods.findOne({'_id': new ObjectID(goodsId)});
    if (!goods) {
      errorHandle(res, 400, APIErrorList.noSuchGoods);
      return;
    }
    let order = goods.createOrder(member._id as ObjectID, count, address, external);
    member.orders.push(order);
    let result1 = await db.member.updateOne({'_id': member._id}, member);
    let result2 = await db.goods.updateOne({'_id': goods._id}, goods);

    successHandle(res, {message: 'order created', data: order});
    return;
  } catch (e) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError);
    return;
  }

}


router.post('/', create);
