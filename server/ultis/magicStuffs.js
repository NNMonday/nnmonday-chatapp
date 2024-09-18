const verificationCodeExpire = 1000 * 60 * 10;
const accessTokenExpire = 1000 * 60 * 10;
const refreshTokenExpire = 1000 * 60 * 60 * 24 * 7;
const refreshTokenExpireRemember = 1000 * 60 * 60 * 24 * 30;

module.exports = {
  verificationCodeExpire,
  accessTokenExpire,
  refreshTokenExpire,
  refreshTokenExpireRemember,
};
