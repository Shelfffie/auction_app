const express = require("express");
const router = express.Router();
const { Users } = require("../models/users");

const { registerUser, loginUser } = require("../controllers/authControllers");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/register", registerUser);

router.post("/login", (req, res) => {
  console.log("Login request received");
  loginUser(req, res);
});

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
});

module.exports = router;
