const express = require("express");
const { createUser, getAllUsers, deleteUser } = require("../controllers/user");
const { verifyToken, verifyAdmin } = require("../middleware/middleware");


const router = express.Router();

router.post("/", createUser);

router.get("/", verifyToken, verifyAdmin, getAllUsers);

router.delete("/:id", verifyToken, deleteUser);

module.exports = router;
