import {Request, Response, Router} from "express";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {checkLoginUser} from "../../util/password";
import {Member} from "../../model/member";
import {mongo} from "../../util/database";
import {ObjectID} from "bson";
import {successHandle} from "../../util/success-handler";

/**
 * remove a goods
 *
 * @param _id the id of the goods
 *
 * only farmer who created the goods can remove it
 */

export let router = Router();

async function remove(req: Request, res: Response) {
  let goodsId = req.body['_id'];

  let member = await checkLoginUser(req, res);
  if (!member) {
    return;
  }

  if (member.role != Member.RoleList.ROLE_FARMER) {
    errorHandle(res, 403, APIErrorList.permissionDeniedModifyGoods);
    return;
  }

  if (!goodsId) {
    errorHandle(res, 400, APIErrorList.informationNotComplete);
    return;
  }

  try {
    let db = await mongo();
    let goods = await db.goods.findOne({'_id': new ObjectID(goodsId)});

    if (!goods) {
      errorHandle(res, 400, APIErrorList.noSuchGoods);
      return;
    }

    let result = await db.goods.deleteOne({'_id': goods._id});

    successHandle(res, {message: 'succeed deleted'});
    return;
  } catch (e) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
    return;
  }

}

router.post('/', remove);
