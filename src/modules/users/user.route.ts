import { Router } from "express";
import { pool } from "../../db";
import { userController } from "./user.controller";
const router = Router(); //sub-router/sb-application

router.post("/", userController.createUser);

export const userRoute = router;
