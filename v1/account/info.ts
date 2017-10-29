import {Request, Response, Router} from "express";
import {checkLoginUser} from "../../util/password";
import {successHandle} from "../../util/success-handler";

/**
 * Info API
 * <p>
 * get user info if login, or return 401
 * </p>
 *
 * @param void
 * @return {@link Member} if success
 */


export let router = Router();

async function info(req: Request, res: Response) {
  let member = await checkLoginUser(req, res);
  successHandle(res, {message: 'user info', data: member})
}

router.post('/', info);