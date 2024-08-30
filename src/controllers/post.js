const { PrismaClientKnownRequestError } = require("@prisma/client");
const { createPostDb, deletePostdb } = require("../domains/post.js");
var jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const prisma = require("../utils/prisma");

const createPost = async (req, res) => {
  const { title, userId } = req.body;

  if (!title || !userId) {
    return res.status(400).json({
      error: "Missing fields in request body",
    });
  }

  try {
    const createdPost = await createPostDb(title, userId);

    return res.status(201).json({ post: createdPost });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res
          .status(409)
          .json({ error: "A user with the provided ID does not exist" });
      }
    }

    res.status(500).json({ error: e.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (req.user.role.name !== "ADMIN" && req.user.id !== post.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized. You are not an admin." });
    }

    const deletedPost = await deletePostdb(id);

    return res.status(200).json({ post: deletedPost });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return res
          .status(409)
          .json({ error: "A user with the provided ID does not exist" });
      }
    }

    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  createPost,
  deletePost,
};
