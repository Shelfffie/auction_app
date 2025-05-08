const jwt = require("jsonwebtoken");
const { Users } = require("../models/users");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findByPk(userId, {
      attributes: ["id", "name", "email", "created_at", "role"],
    });

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
};

module.exports = { getUserProfile };
