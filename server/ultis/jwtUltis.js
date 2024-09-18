const jwt = require("jsonwebtoken");
const {
  accessTokenExpire,
  refreshTokenExpireRemember,
  refreshTokenExpire,
  verificationCodeExpire,
} = require("../ultis/magicStuffs");

const generateVerificationCode = (_id) => {
  return jwt.sign(
    {
      _id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: verificationCodeExpire,
    }
  );
};

const getIdFromVerificationCode = (verificationCode) => {
  const { _id } = jwt.verify(verificationCode, process.env.JWT_SECRET_KEY);
  return _id;
};

const generateAccessToken = (_id) => {
  const maxAge = accessTokenExpire;
  return {
    value: jwt.sign(
      {
        _id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: maxAge,
      }
    ),
    maxAge,
  };
};

const generateRefreshToken = (_id, rememberMe) => {
  const maxAge = rememberMe ? refreshTokenExpireRemember : refreshTokenExpire;
  return {
    value: jwt.sign(
      {
        _id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: maxAge,
      }
    ),
    maxAge,
  };
};

module.exports = {
  generateVerificationCode,
  getIdFromVerificationCode,
  generateAccessToken,
  generateRefreshToken,
};
