const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Токен відсутній" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Токен невалідний" });
    }

    req.user = { id: decoded.userId, user_role: decoded.role };
    next();
  });
};

module.exports = verifyToken;
