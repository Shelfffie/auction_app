const verifyAdmin = (req, res, next) => {
  if (req.user.user_role !== "admin") {
    return res.status(403).json({ message: "Немає прав доступу" });
  }
  next();
};

module.exports = verifyAdmin;
