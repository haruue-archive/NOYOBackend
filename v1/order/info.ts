import {Request, Response, Router} from "express";
import {checkLoginUser} from "../../util/password";
import {successHandle} from "../../util/success-handler";
import {APIErrorList, errorHandle} from "../../util/error-handler";

/**
 * get a order info of my orders
 *
 * @param _id order id
 *
 * only the consumers can list their orders.
 *
 * @type {Router}
 */

export let router = Router();

async function info(req: Request, res: Response) {
  let member = await checkLoginUser(req, res);
  if (!member) {
    return;
  }

  let id = req.body['_id'];

  let order = member.orders.find((value) => {
    return value._id.toHexString() == id;
  });

  if (!order) {
    errorHandle(res, 400, APIErrorList.noSuchOrder);
    return;
  }

  successHandle(res, {message: 'order list', data: order});
}

router.post('/', info);
