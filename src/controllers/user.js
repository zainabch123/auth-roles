const { PrismaClientKnownRequestError } = require("@prisma/client");
var jwt = require("jsonwebtoken");
const {
  createUserDb,
  getAllUserdb,
  deleteUserdb,
} = require("../domains/user.js");
const secret = process.env.JWT_SECRET;
const prisma = require("../utils/prisma");

const createUser = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Missing fields in request body",
    });
  }

  try {
    const createdUser = await createUserDb(username, password, role);

    const token = jwt.sign({ id: createdUser.id }, secret);

    return res.status(201).json({ user: createdUser, token: token });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res
          .status(409)
          .json({ error: "A user with the provided username already exists" });
      }
    }

    res.status(500).json({ error: e.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.sub,
      },
    });

    // only ADMIN users can make this request
    if (user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Unauthorized. You are not an admin." });
    }

    console.log(req);

    const allUsers = await getAllUserdb();

    return res.status(200).json({ users: allUsers });
  } catch (err) {
    console.log("Error:", err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.sub,
      },
    });

    // only ADMIN users can make this request
    if (user.role !== "ADMIN" && user.id !== id) {
      return res
        .status(403)
        .json({ error: "Unauthorized. You are not an admin." });
    }

    const deletedUser = await deleteUserdb(id);

    return res.status(200).json({ user: deletedUser });
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
};
