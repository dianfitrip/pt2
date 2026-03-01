const bcrypt = require("bcryptjs");
const { User } = require("../models");

const generatePassword = () =>
  Math.random().toString(36).slice(-8);

exports.createUser = async (
  { username, email, no_hp, id_role },
  { transaction }
) => {

  const existing = await User.findOne({
    where: { username },
    transaction
  });

  if (existing) {
    throw new Error("Username sudah digunakan");
  }

  const rawPassword = generatePassword();
  const password_hash = await bcrypt.hash(rawPassword, 10);

  const user = await User.create({
    username,
    password_hash,
    id_role,
    email,
    no_hp
  }, { transaction });

  return { user, rawPassword };
};

exports.resetUserPassword = async (user) => {
  const rawPassword = generatePassword();
  const hashed = await bcrypt.hash(rawPassword, 10);

  await user.update({ password_hash: hashed });

  return rawPassword;
};