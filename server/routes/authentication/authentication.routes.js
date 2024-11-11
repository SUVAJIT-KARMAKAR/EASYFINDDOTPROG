import { Router } from "express";
import {
    handle_user_login,
    handle_user_logout,
    handle_user_registration,
    handle_user_validation
} from "../../controllers/authentication/authentication.controller.js";


export const authenticationRouter = Router();
authenticationRouter.route("/register").post(handle_user_registration);
authenticationRouter.route("/login").post(handle_user_login);
authenticationRouter.route("/logout").post(handle_user_logout);
authenticationRouter.route("/validation").get(handle_user_validation);