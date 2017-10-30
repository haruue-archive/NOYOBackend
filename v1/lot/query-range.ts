import {Request, Response, Router} from "express";
import {APIErrorList, errorHandle} from "../../util/error-handler";
import {mongo} from "../../util/database";
import {successHandle} from "../../util/success-handler";

/**
 * Query Lots by location range
 * <p>
 * this api can be used to show all lot point in a map
 *
 *    d ^------------------------------+
 *    L |                              |
 *    a |                              |
 *    t |                              |
 *      |                              |
 *      |                              |
 *      |                              |
 *      |                              |
 *      |                              |
 *      |                              |
 *      x------------------------------>
 *  the start point                  dLng
 *
 *
 * @param lat the latitude of start point
 * @param lng the longitude of start point
 * @param dLat
 * @param dLng
 *
 */

export let router = Router();

async function queryRange(req: Request, res: Response) {
  let lat = parseInt(req.body.lat);
  let lng = parseInt(req.body.lng);
  let dLat = parseInt(req.body.dLat);
  let dLng = parseInt(req.body.dLng);
  let checkNaN = [lat, lng, dLat, dLng].every((num) => {
    return !isNaN(num);
  });
  if (checkNaN) {
    errorHandle(res, 400, APIErrorList.queryRangeInfoLackOrEmpty);
    return;
  }
  let [sLat, lLat] = sort(lat, lat + dLat);
  let [sLng, lLng] = sort(lng, lng + dLng);
  let query = {
    location: {
      lat: {"$gt": sLat, "$lt": lLat},
      lng: {"$gt": sLng, "$lt": lLng}
    }
  };
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

function sort(a: number, b: number): number[] {
  if (a > b) {
    [a, b] = [b, a]
  }
  return [a, b];
}

router.post('/query-range', queryRange);