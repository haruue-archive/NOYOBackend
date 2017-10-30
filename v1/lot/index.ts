import {Router} from "express";
import {router as info} from "./info";
import {router as query} from "./query";

export let router = Router();

router.use('/info', info);
router.use('/query', query);