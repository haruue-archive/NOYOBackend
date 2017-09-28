import {Router} from "express";
import {router as register} from "./register";
import {router as login} from "./login";

export let router = Router();

router.use('/register', register);
router.use('/login', login);

