const prisma = require("../../src/utils/prisma")
const bcrypt = require('bcrypt');

const createUser = async (username, password, role = 'USER') => {
  return await prisma.user.create({
    data: {
      username,
      role,
      passwordHash: await bcrypt.hash(password, 6)
    },
  })
}

module.exports = {
    createUser
}
