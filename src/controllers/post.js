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

    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.sub,
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    // only ADMIN users can make this request
    if (user.role !== "ADMIN" && user.id !== post.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized. You are not an admin." });
    }

    const deletedPost = await deletePostdb(id);

    return res.status(200).json({ post: deletedPost });
  } catch (err) {
    console.log("Error:", err);
  }
};

module.exports = {
  createPost,
  deletePost,
};
