import {Router} from "express";
import {router as list} from "./list";

export let router = Router();

router.use('/list', list);
