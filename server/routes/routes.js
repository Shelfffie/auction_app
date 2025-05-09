const express = require("express");
const router = express.Router();
const { Users } = require("../models");

const { registerUser, loginUser } = require("../controllers/authControllers");
const { profileContr } = require("../controllers/profileControllers.js");
const verifyToken = require("../middlewares/authMiddleware");
const { LotContrl, IdLots } = require("../controllers/lotsController");
const { getUserProfile } = require("../controllers/anotherUserControl");
const upload = require("../middlewares/uploadMiddlewares");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      user_role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
});

router.put("/profile", verifyToken, (req, res) => {
  console.log("Put");
  profileContr(req, res);
});

router.get("/user/:id", getUserProfile);

router.post("/lots/create", verifyToken, upload.single("image"), LotContrl);

router.get("/lot/:id", IdLots);

module.exports = router;
