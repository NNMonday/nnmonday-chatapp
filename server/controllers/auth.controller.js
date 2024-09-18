const AuthService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    await AuthService.register({
      username,
      email,
      password,
    });
    res.status(201).json({
      message:
        "Register successfully! Please check your email inbox for verification email",
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationCode } = req.params;
    await AuthService.verifyEmail(verificationCode);
    res.status(200).json({
      message: "Successfully verified, now you can login",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password, rememberMe } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login({
      username,
      password,
      rememberMe,
    });
    res.cookie("accessToken", accessToken.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: accessToken.maxAge,
    });
    res.cookie("refreshToken", refreshToken.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: refreshToken.maxAge,
    });
    res.status(200).json({
      message: "Login successfully",
      data: { ...user },
    });
  } catch (error) {
    next(error);
  }
};

const AuthController = {
  register,
  verifyEmail,
  login,
};

module.exports = AuthController;
