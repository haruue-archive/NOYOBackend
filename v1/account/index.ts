import {Router} from "express";
import {router as register} from "./register";
import {router as login} from "./login";
import {router as info} from "./info";
import {router as verify} from "./verify";
import {router as logout} from "./logout";
import {router as update} from "./update";

export let router = Router();

router.use('/register', register);
router.use('/login', login);
router.use('/info', info);
router.use('/verify', verify);
router.use('/logout', logout);
router.use('/update', update);
