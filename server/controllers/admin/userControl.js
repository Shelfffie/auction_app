const jwt = require("jsonwebtoken");
const { Users, Lots, Bids } = require("../../models");

const GetUserInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findByPk(userId, {
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "status",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: Lots,
          attributes: ["id"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      created_at: user.created_at,
      user_role: user.role,
      lots: user.Lots.map((lot) => ({
        id: lot.id,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

const editUserControl = async (req, res) => {
  const fieldForEditing = ["name", "email", "role", "status"];

  const updates = {};

  for (const field of fieldForEditing) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Немає даних для оновлення" });
  }
  try {
    const user = await Users.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    Object.assign(user, updates);
    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Помилка оновлення", error);
    res.status(500).json({ message: "Помилка серверу" });
  }
};

const deletUserControl = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    await user.destroy();
    res.status(200).json({ message: "Користувача видалено" });
  } catch (error) {
    console.error("Помилка при видаленні,", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = { GetUserInfo, editUserControl, deletUserControl };
