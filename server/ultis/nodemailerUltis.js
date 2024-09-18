const nodemailer = require("nodemailer");
const { verificationEmail } = require("./emailTemplates");
const { generateVerificationCode } = require("./jwtUltis");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendVerificationEmail = async ({ email, _id }) => {
  try {
    await transporter.sendMail({
      from: `"Verify your account" <${process.env.MAIL}>`,
      to: email,
      subject: "This is your verification email from NNMonday-ChatApp",
      text: "This is your verification email from NNMonday-ChatApp",
      html: verificationEmail(generateVerificationCode(_id)),
    });

    return;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
};
