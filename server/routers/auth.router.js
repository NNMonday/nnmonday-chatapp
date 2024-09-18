const express = require("express");
const { AuthController } = require("../controllers");

const AuthRouter = express.Router();

AuthRouter.post("/register", AuthController.register);
AuthRouter.post("/verify/:verificationCode", AuthController.verifyEmail);
AuthRouter.post("/login", AuthController.login);

module.exports = AuthRouter;
