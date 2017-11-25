import {Request, Response, Router} from "express";
import {successHandle} from "../../util/success-handler";

export let router = Router();

async function logout(req: Request, res: Response) {
  res.clearCookie('uid');
  successHandle(res, {message: 'logout'});
}

router.post('/', logout);