import {Request, Response, Router} from "express";
import {checkLoginUser} from "../../util/password";
import {Member} from "../../model/member";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {isUndefined} from "util";
import {Goods} from "../../model/goods";
import {mongo} from "../../util/database";
import {ObjectID} from "bson";
import {successHandle} from "../../util/success-handler";

/**
 * update a goods
 * please parse ALL field of a goods, even if it won't be update
 *
 * @param _id the id of the goods will be update
 * @param title
 * @param summary
 * @param count
 * @param price
 * @param (optional) image
 * @param type in ["mud", "product"]
 * @param address
 *
 * only farmer who created the goods can remove it
 */

export let router = Router();

async function update(req: Request, res: Response) {

  let member = await checkLoginUser(req, res);
  if (!member) {
    return;
  }

  if (member.role != Member.RoleList.ROLE_FARMER) {
    errorHandle(res, 403, APIErrorList.permissionDeniedModifyGoods);
    return;
  }

  let goodsId = req.body['_id'];
  let title = req.body.title;
  let summary = req.body.summary;
  let count = parseFloat(req.body['count']);
  let price = parseFloat(req.body.price);
  let image = req.body.image;
  let type = req.body.type;
  let address = req.body.address;

  if (!goodsId || !title || !summary || isUndefined(count) || !price || !type || !address) {
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

    goods.title = title;
    goods.summary = summary;
    goods.count = count;
    goods.price = price;
    goods.image = image;
    goods.type = type;
    goods.address = address;

    let result = db.goods.updateOne({'_id': goods._id}, goods);

    successHandle(res, {message: 'update success', data: goods});
    return;
  } catch (e) {
    errorHandle(res, 500, APIErrorList.unexpectedDatabaseError, e);
    return;
  }

}

router.post('/', update);