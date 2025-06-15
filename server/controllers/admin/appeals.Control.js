const { Appeals, Users } = require("../../models");

const showActiveAppeals = async (req, res) => {
  try {
    const requests = await Appeals.findAll({
      where: { status: "pending" },
      attributes: ["id", "description", "user_id", "status", "created_at"],
      include: [{ model: Users, as: "banned_user", attributes: ["name"] }],
    });

    if (!requests) {
      return res.status(404).json({ message: "Заявки відсутні." });
    }

    res.json(requests);
  } catch (error) {
    console.log("Помилка при отриманні заявок:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const GetAllAppeals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const { count, rows: requests } = await Appeals.findAndCountAll({
      order: [["created_at", "DESC"]],
      limit,
      offset,
      attributes: ["id", "description", "user_id", "status", "created_at"],
      include: [{ model: Users, as: "banned_user", attributes: ["name"] }],
    });

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: "Заявок немає" });
    }

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      requests,
    });
  } catch (error) {
    console.log("Помилка:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const changeAppealStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Невірний статус" });
    }

    const request = await Appeals.findByPk(id, {
      include: [
        { model: Users, as: "banned_user", attributes: ["id", "status"] },
      ],
    });

    if (!request) {
      return res.status(404).json({ message: "Заявку не знайдено" });
    }

    request.status = status;
    await request.save();

    if (status === "approved" && request.banned_user) {
      request.banned_user.status = "active";

      await request.banned_user.save();
    }

    res.json({
      message: `Заявку ${status === "approved" ? "схвалено" : "відхилено"}`,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = { GetAllAppeals, showActiveAppeals, changeAppealStatus };
