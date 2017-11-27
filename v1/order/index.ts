import {Router} from "express";
import {router as list} from "./list";
import {router as create} from "./create";
import {router as cancel} from "./cancel";
import {router as info} from "./info";

export let router = Router();

router.use('/list', list);
router.use('/create', create);
router.use('/cancel', cancel);
router.use('/info', info);

