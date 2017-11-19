import {Request, Response, Router} from "express";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {mongo} from "../../util/database";
import {successHandle} from "../../util/success-handler";
import {ObjectID} from "bson";

/**
 * Get Lot information API
 *
 * @param id _id of a lot
 * @return {@link Lot} if success
 */


export let router = Router();

async function info(req: Request, res: Response) {
  let id = req.body['id'];
  if (!id) {
    errorHandle(res, 400, APIErrorList.lotIdEmpty);
    return;
  }
  try {
    let db = await mongo();
    let result = await db.lot.findOne({"_id": new ObjectID(id)});
    if (!result) {
      result = null;
    }
    successHandle(res, {message: 'get info success', data: result});
  } catch (e) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
  }
}

router.post('/', info);