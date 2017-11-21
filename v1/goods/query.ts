import {Request, Response, Router} from "express";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {Goods} from "../../model/goods";
import {mongo} from "../../util/database";
import {successHandle} from "../../util/success-handler";

/**
 * simple query
 *
 * @param what (path) a field to query, could be one of
 *  + title
 *  + type
 *  + address
 *  + seller (id)
 *
 * @param value
 *
 */


export let router = Router();

async function query(req: Request, res: Response) {
  let what = req.params.what;
  let value = req.body.value;

  if (!what) {
    errorHandle(res, 400, APIErrorList.informationNotComplete);
    return;
  }

  if (what == "title" || what == "address" || what == "seller") {
    if (!value) {
      errorHandle(res, 400, APIErrorList.informationNotComplete);
      return;
    }
  } else if (what == "type") {
    if (Goods.TYPES.indexOf(value) < 0) {
      errorHandle(res, 400, APIErrorList.errorType);
      return;
    }
  } else {
    errorHandle(res, 400, APIErrorList.noSuchGoodsQueryField);
    return;
  }

  try {
    let db = await mongo();
    let query: any = {};

    if (what == "type" || what == "seller") {
      // exactly
      query[what] = value;
    } else {
      query[what] = new RegExp(`.*${value}.*`, 'g');
    }

    let result = await db.goods.find(query).toArray();

    if (!result) {
      result = [];
    }

    successHandle(res, {message: 'query result', data: result});
    return;
  } catch (e) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
    return
  }

}

router.post('/:what', query);
