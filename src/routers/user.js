const express = require("express");
const { createUser, getAllUsers, deleteUser } = require("../controllers/user");
const { verifyToken, verifyAdmin, checkPermissions } = require("../middleware/middleware");


const router = express.Router();

router.post("/", createUser);

router.get("/", verifyToken, verifyAdmin, checkPermissions("GET_ALL_USERS"), getAllUsers);

router.delete("/:id", verifyToken, checkPermissions(["DELETE_ANY_USERS", "DELETE_MY_USER"]), deleteUser);

module.exports = router;
