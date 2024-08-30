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
      include: {
        role: {
          include: {
            permissions: true, // Eagerly load all permissions
          },
        },
      },
    });

    //Need to define what this function will pass on to the next middleware function:
    req.user = user;

    // console.log("req.user", req.user)
  } catch (err) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }
  next();
}

async function verifyAdmin(req, res, next) {
  // console.log("req user", req.user);
  console.log("permissions logs", req.user.role.permissions);

  if (req.user.role.name !== "ADMIN") {
    return res.status(403).json({ error: "You are not authrorized." });
  }

  next();
}

function checkPermissions(requiredPermission) {
  return function (req, res, next) {
    const userPermissions = req.user.role.permissions;

    // console.log("permissions", userPermissions)

    const hasPermission = userPermissions.map(
      (permission) => permission === "GET_ALL_USERS"
    );

    if (!hasPermission) {
      return res.status(403).json({ error: "You are not authorized." });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  verifyAdmin,
  checkPermissions,
};
