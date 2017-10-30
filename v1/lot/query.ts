import {Request, Response, Router} from "express";
import {mongo} from "../../util/database";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {successHandle} from "../../util/success-handler";

/**
 * Query Lots API
 * <p>
 * query lots by name or address, which may be used by user in search box as usual.
 * for query by lot location, please use {@link queryRange}
 *
 * @param byWhat (in path) query by what, may be "name" "address"
 * @param q query string
 */

export let router = Router();

async function query(req: Request, res: Response) {
  let byWhat = req.params.byWhat;
  if (byWhat !in ['name', 'address']) {
    byWhat = 'name';
  }
  let queryString = req.body.q;
  if (!queryString) {
    errorHandle(res, 400, APIErrorList.queryStringEmpty);
    return;
  }
  let query: any = {};
  query[byWhat] = queryString;
  try {
    let db = await mongo();
    let result = await db.lot.find(query).toArray();
    if (!result) {
      result = [];
    }
    successHandle(res, {message: 'query success', data: result});
  } catch (e) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
  }


}


router.post('/:byWhat', query);