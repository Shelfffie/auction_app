const jwt = require("jsonwebtoken");
const { Users } = require("../models");

const profileContr = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Немає даних для оновлення" });
    }

    const user = await Users.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    if (name) user.name = name;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Помилка оновлення профілю", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { profileContr };
