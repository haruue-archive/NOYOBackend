import {Request, Response, Router} from "express";
import {checkLoginUser} from "../../util/password";
import {Member} from "../../model/member";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {Order} from "../../model/order";
import {ObjectID} from "bson";
import {mongo} from "../../util/database";
import {successHandle} from "../../util/success-handler";

/**
 * cancel a order
 *
 * @param _id id of order
 *
 * only consumer can cancel their own order
 * only orders in STATUS_WAITING_PAY and STATUS_PAID can be cancel
 *
 */

export let router = Router();

async function cancel(req: Request, res: Response) {
  let member = await checkLoginUser(req, res);
  if (!member) {
    return;
  }

  if (member.role != Member.RoleList.ROLE_CONSUMER) {
    errorHandle(res, 400, APIErrorList.permissionDeniedModifyOrder);
    return;
  }

  let _id = req.body._id;

  let order = member.orders.find((value: Order) => {
    return value._id.toHexString() == _id;
  });

  if (!order) {
    errorHandle(res, 400, APIErrorList.noSuchOrder);
    return;
  }

  if ([Order.StatusList.STATUS_WAITING_PAY, Order.StatusList.STATUS_PAID].indexOf(order.status) < 0) {
    errorHandle(res, 400, APIErrorList.errorOrderStatus);
    return;
  }

  order.status = Order.StatusList.STATUS_CANCELLED as -1;

  try {
    let db = await mongo();
    let result1 = await db.member.updateOne({'_id': member._id}, member);

    let goods = await db.goods.findOne({'_id': order.goodsId});

    if (goods) {
      goods.orders.forEach((o) => {
        if (o._id.toHexString() == _id) {
          o.status = Order.StatusList.STATUS_CANCELLED as -1;
        }
      });
      let result2 = await db.goods.updateOne({'_id': goods._id}, goods);
    }

    successHandle(res, {message: 'cancel succeed', data: order});
    return;
  } catch (e) {
    errorHandle(res, 400, APIErrorList.unexpectedDatabaseError);
    return;
  }

}

router.post('/', cancel);
