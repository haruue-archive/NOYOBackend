import { Router } from "express";
import {router as account} from "./account/index";

export let router = Router();

router.use('/account', account);