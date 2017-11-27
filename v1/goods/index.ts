import {Router} from "express";
import {router as list} from './list';
import {router as create} from './create';
import {router as remove} from './remove';
import {router as update} from './update';
import {router as query} from './query';
import {router as info} from "./info";

export let router = Router();

router.use('/list', list);
router.use('/create', create);
router.use('/remove', remove);
router.use('/update', update);
router.use('/query', query);
router.use('/info', info);
