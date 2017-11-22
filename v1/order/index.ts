import {Router} from "express";
import {router as list} from "./list";
import {router as create} from "./create";
import {router as cancel} from "./cancel";

export let router = Router();

router.use('/list', list);
router.use('/create', create);
router.use('/cancel', cancel);

