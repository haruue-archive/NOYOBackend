import {Request, Response, Router} from "express";
import {Goods} from "../../model/goods";
import {mongo} from "../../util/database";
import {successHandle} from "../../util/success-handler";
import {APIErrorList, errorHandle} from "../../util/error-handler";

/**
 * get a list of goods,
 * not support page now...
 *
 * @param type "mud" or "product" or "all", default is "all"
 *
 * anyone (even not yet login member) can access list
 */

export let router = Router();

async function list(req: Request, res: Response) {
  let type = req.body.mud;
  try {
    let db = await mongo();
    let list: Array<Goods> = [];
    if (Goods.TYPES.indexOf(type) < 0) {
      list = await db.goods.find().toArray()
    } else {
      list = await db.goods.find({type: type}).toArray();
    }
    if (!list) {
      list = [];
    }
    successHandle(res, {message: 'result', data: list});
    return;
  } catch (e) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
    return;
  }
}

router.post('/', list);
