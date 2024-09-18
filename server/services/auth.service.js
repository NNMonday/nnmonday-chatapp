const bcrypt = require("bcryptjs");
const httpErrors = require("http-errors");
const jwt = require("jsonwebtoken");

const { UserRepository } = require("../repositories");
const { sendVerificationEmail } = require("../ultis/nodemailerUltis");
const {
  getIdFromVerificationCode,
  generateAccessToken,
  generateRefreshToken,
} = require("../ultis/jwtUltis");
const {
  validateEmailFormat,
  checkUsedEmail,
  validatePassword,
  validateEmptyFields,
} = require("../ultis/validateFns");

const register = async ({ username = "", email = "", password = "" }) => {
  if (!validateEmptyFields({ username, email, password })) {
    throw httpErrors.BadRequest("Empty fields are not allowed");
  }
  if (!validateEmailFormat(email)) {
    throw httpErrors.BadRequest("Invalid email format");
  }
  if (await checkUsedEmail(email)) {
    throw httpErrors.Conflict("Email already in use");
  }
  if (!validatePassword(password)) {
    throw httpErrors.BadRequest("Password does not meet enough criteria");
  }
  const hashedPassword = bcrypt.hashSync(
    password,
    bcrypt.genSaltSync(parseInt(process.env.SALT_ROUND, 10))
  );
  const { _id } = await UserRepository.create({
    username,
    email,
    hashedPassword: password,
    // hashedPassword: hashedPassword,
  });

  await sendVerificationEmail({ email, _id });
  return;
};

const verifyEmail = async (verificationCode) => {
  try {
    const _id = getIdFromVerificationCode(verificationCode);
    const user = await UserRepository.findOneById(_id);
    if (!user) {
      throw httpErrors.NotFound("User not found");
    } else if (user.verify) {
      throw httpErrors.Conflict("This user is already verified");
    } else {
      return await UserRepository.verifyEmail(_id);
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const { _id } = jwt.decode(verificationCode);
      const user = await UserRepository.findOneById(_id);
      if (!user) {
        throw httpErrors.NotFound("User not found");
      }
      await sendVerificationEmail({ email: user.email, _id });
      throw httpErrors.Unauthorized(
        "Verification token has expired. A new verification email has been sent."
      );
    } else {
      throw err;
    }
  }
};

const login = async ({ username, password, rememberMe }) => {
  let user;
  if (validateEmailFormat(username)) {
    user = await UserRepository.findOneByEmail(username);
  } else {
    user = await UserRepository.findOneByUsername(username);
  }
  if (!user) {
    throw httpErrors.NotFound("Username or email incorrect");
  } else if (!user.verify) {
    throw httpErrors.Forbidden(
      "Account not verified. Please verify your email address before logging in."
    );
    // } else if (!bcrypt.compareSync(password, user.password)) {
  } else if (!password === user.password) {
    throw httpErrors.BadRequest("Password incorrect");
  } else {
    return {
      user,
      accessToken: generateAccessToken(user._id),
      refreshToken: generateRefreshToken(user._id, rememberMe),
    };
  }
};

const AuthService = {
  register,
  verifyEmail,
  login,
};

module.exports = AuthService;
