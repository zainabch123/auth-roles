const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");

const createUserDb = async (username, password, role) =>
  await prisma.user.create({
    data: {
      username,
      passwordHash: await bcrypt.hash(password, 6),
      role,
    },
  });

const getAllUserdb = async () => {
  return await prisma.user.findMany();
};

const deleteUserdb = async (id) => {
  return await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  createUserDb,
  getAllUserdb,
  deleteUserdb,
};
