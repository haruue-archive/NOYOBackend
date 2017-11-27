import {Request, Response, Router} from "express";
import {Goods} from "../../model/goods";
import {mongo} from "../../util/database";
import {successHandle} from "../../util/success-handler";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {ObjectID} from "bson";

/**
 * get a list of goods,
 * not support page now...
 *
 * @param _id id of a goods
 *
 * anyone (even not yet login member) can access goods info
 */

export let router = Router();

async function info(req: Request, res: Response) {
  let id = req.body['_id'];

  if (!id) {
    errorHandle(res, 400, APIErrorList.informationNotComplete)
    return;
  }

  try {
    let db = await mongo();

    let result = await db.goods.findOne({'_id': new ObjectID(id)});

    if (!result) {
      errorHandle(res, 400, APIErrorList.noSuchGoods);
      return;
    }

    successHandle(res, {message: 'goods info', data: result});

  } catch (e) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
    return;
  }
}

router.post('/', info);
