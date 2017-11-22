import {Request, Response, Router} from "express";
import {checkLoginUser} from "../../util/password";
import {successHandle} from "../../util/success-handler";

/**
 * let my orders
 *
 * only the consumers can list their orders.
 *
 * @type {Router}
 */

export let router = Router();

async function list(req: Request, res: Response) {
  let member = await checkLoginUser(req, res);
  if (!member) {
    return;
  }

  if (!member.orders) {
    member.orders = [];
  }

  successHandle(res, {message: 'order list', data: member.orders});
}

router.post('/', list);
