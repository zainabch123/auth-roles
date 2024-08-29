const prisma = require("../utils/prisma");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

async function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      error: "Authorization missing in headers",
    });
  }
  try {
    const decoded = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.sub, //dont forget to change back to sub.
      },
    });

    req.user = user;
  } catch (err) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }
  next()
}

async function verifyAdmin(req, res, next) {
  console.log("req user", req.user);

  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "You are not authrorized." });
  }

  next()
}

module.exports = {
  verifyToken,
  verifyAdmin,
};
