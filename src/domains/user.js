const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");

const createUserDb = async (username, password, role) => {
  return await prisma.user.create({
    data: {
      username,
      passwordHash: await bcrypt.hash(password, 6),
      role: role
        ? {
            connect: {
              name: role,
            },
          }
        : undefined, //If role is not provided, don't include the role field.
    },
    include: {
      role: true,
    },
  });
};

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
