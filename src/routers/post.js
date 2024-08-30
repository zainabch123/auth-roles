const express = require("express");
const { createPost, deletePost } = require("../controllers/post");
const { verifyToken, checkPermissions } = require("../middleware/middleware");

const router = express.Router();

router.post("/", createPost);

router.delete(
  "/:id",
  verifyToken,
  checkPermissions(["DELETE_ANY_POST", "DELETE_MY_POST"]),
  deletePost
);

module.exports = router;
