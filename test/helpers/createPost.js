const prisma = require("../../src/utils/prisma")
const bcrypt = require('bcrypt');

const createPost = async (title, userId) => {
  return await prisma.post.create({
    data: {
      title,
      user: {
        connect: {
            id: userId
        }
      }
    },
  })
}

module.exports = {
    createPost
}
