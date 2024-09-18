const { User } = require("../models");

const create = async ({ username, email, hashedPassword }) => {
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  return await newUser.save();
};

const findOneByEmail = async (email) => {
  return await User.findOne({ email }).exec();
};

const findOneById = async (id) => {
  return await User.findById(id).exec();
};

const verifyEmail = async (id) => {
  return await User.findByIdAndUpdate(
    id,
    {
      verify: true,
    },
    {
      new: true,
    }
  ).exec();
};

const findOneByUsername = async (username = "") => {
  return await User.findOne({ username }).exec();
};

const UserRepository = {
  create,
  findOneByEmail,
  findOneById,
  verifyEmail,
  findOneByUsername,
};

module.exports = UserRepository;
