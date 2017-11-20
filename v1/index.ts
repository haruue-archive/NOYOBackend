import { Router } from "express";
import {router as account} from "./account";

export let router = Router();

router.use('/account', account);
