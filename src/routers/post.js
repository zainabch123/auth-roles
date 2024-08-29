const express = require("express");
const { createPost, deletePost } = require("../controllers/post");

const router = express.Router();

router.post("/", createPost);

router.delete("/:id", deletePost);

module.exports = router;
