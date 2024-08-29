const express = require("express");
const { createUser, getAllUsers, deleteUser } = require("../controllers/user");


const router = express.Router();

router.post("/", createUser);

router.get("/", getAllUsers);

router.delete("/:id", deleteUser);

module.exports = router;
