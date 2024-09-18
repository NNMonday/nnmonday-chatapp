const { UserRepository } = require("../repositories");

const validateEmptyFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value.trim()) {
      return false;
    }
  }
  return true;
};

const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const minLength = 8;
  const maxLength = 24;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isValidLength =
    password.length >= minLength && password.length <= maxLength;

  return !(
    !isValidLength ||
    !hasLowercase ||
    !hasUppercase ||
    !hasNumber ||
    !hasSpecialChar
  );
};

const checkUsedEmail = async (email) => {
  return await UserRepository.findOneByEmail(email);
};

module.exports = {
  validateEmptyFields,
  validateEmailFormat,
  checkUsedEmail,
  validatePassword,
};
