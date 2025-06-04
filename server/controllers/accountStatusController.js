const { Users } = require("../models");

const recoverAcount = async (req, res) => {
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ message: "Немає даних" });
    }

    const allowedStatus = ["active"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Недозволений статус" });
    }

    const user = await Users.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    if (user.status !== "deleted") {
      return res
        .status(403)
        .json({ message: "Тільки видалений акаунт можливо відновили" });
    }

    user.status = status;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Помилка відновлення акаунту", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { recoverAcount };
