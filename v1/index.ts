import { Router } from "express";
import {router as account} from "./account";
import {router as car} from "./car";

export let router = Router();

router.use('/account', account);
router.use('/car', car);