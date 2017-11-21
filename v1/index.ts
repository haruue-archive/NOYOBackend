import { Router } from "express";
import {router as account} from "./account";
import {router as goods} from "./goods";
import {router as order} from "./order";

export let router = Router();

router.use('/account', account);
router.use('/goods', goods);
router.use('/order', order);
