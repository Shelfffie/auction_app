const { Appeals, Users } = require("../models");

const NewRecoveryController = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Тільки авторизовані користувачі можуть надсилати заявки",
      });
    }

    console.log("BODY:", req.body);
    const { description } = req.body;
    const user_id = req.user.id;

    const userInfo = await Users.findOne({ where: { id: user_id } });

    if (!userInfo || userInfo.status !== "banned") {
      return res.status(403).json({
        message: "Тільки заблоковані користувачі можуть надсилати заявки.",
      });
    }

    if (!description) {
      return res.status(400).json({ message: "Поля повинні бути заповнені." });
    }

    const appeals = await Appeals.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });

    const appealsCount = appeals.length;
    const lastAppeal = appeals[0];

    if (lastAppeal?.status === "approved") {
      return res.status(403).json({
        message: "Ваша заявка вже схвалена. Нові заявки не дозволені.",
      });
    }

    if (lastAppeal?.status === "pending") {
      return res.status(403).json({
        message: "Ваша заявка вже в обробці.",
      });
    }

    if (appealsCount >= 3 && lastAppeal?.status === "rejected") {
      return res.status(403).json({
        message: "Ви досягли ліміту на кількість заявок.",
      });
    }

    const newAppeal = await Appeals.create({ user_id, description });

    res.status(201).json({ message: "Заявку створено!", id: newAppeal.id });
  } catch (error) {
    console.error("Creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const GetUserAppeal = async (req, res) => {
  try {
    const userId = req.user.id;

    const appeals = await Appeals.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    if (!appeals || appeals.length === 0) {
      return res.status(404).json({ message: "Заявок не знайдено." });
    }
    res.status(200).json({ appeals });
  } catch (error) {
    console.error("Помилка при отриманні заявки:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { NewRecoveryController, GetUserAppeal };
