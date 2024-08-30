const prisma = require("../../src/utils/prisma");
const bcrypt = require("bcrypt");

const createUser = async (username, password, role = "USER") => {
  return await prisma.user.create({
    data: {
      username,
      passwordHash: await bcrypt.hash(password, 6),
      role: {
        connect: {
          name: role,
        },
      },
    },
  });
};

module.exports = {
  createUser,
};
