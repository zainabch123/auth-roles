const { PrismaClientKnownRequestError } = require("@prisma/client")
const { createPostDb } = require('../domains/post.js')

const createPost = async (req, res) => {
  const {
    title,
    userId
  } = req.body

  if (!title || !userId) {
    return res.status(400).json({
      error: "Missing fields in request body"
    })
  }

  try {
    const createdPost = await createPostDb(title, userId)

    return res.status(201).json({ post: createdPost })
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res.status(409).json({ error: "A user with the provided ID does not exist" })
      }
    }

    res.status(500).json({ error: e.message })
  }
}

module.exports = {
  createPost
}
