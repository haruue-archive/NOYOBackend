import {Router} from "express";
import {router as add} from "./add";
import {router as remove} from "./remove";

export let router = Router();

router.use('/add', add);
router.use('/remove', remove);
