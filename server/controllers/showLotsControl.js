const { Lots, Users } = require("../models");
const { Op } = require("sequelize");

const showLots = async (req, res) => {
  try {
    const lots = await Lots.findAll({
      where: { status: "active" },
      limit: 2,
      order: [["created_at", "DESC"]],
      attributes: ["id", "image_url", "title", "description"],
      include: [
        {
          model: Users,
          as: "creator",
          attributes: ["id", "name"],
        },
      ],
    });

    if (lots.length === 0) {
      return res.status(404).json({ message: "Лот не знайдено" });
    }

    res.json(lots);
  } catch (error) {
    console.log("Помилка при отриманні останніх логів:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const showActiveLots = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows: lots } = await Lots.findAndCountAll({
      where: {
        status: {
          [Op.in]: ["active", "pending"],
        },
      },
      order: [["created_at", "DESC"]],
      limit,
      offset,
      attributes: [
        "id",
        "image_url",
        "title",
        "description",
        "start_price",
        "start_time",
        "end_time",
        "status",
      ],
      include: [
        {
          model: Users,
          as: "creator",
          attributes: ["id", "name", "created_at"],
        },
      ],
    });

    if (lots.length === 0) {
      return res.status(404).json({ message: "Лоти не знайдено" });
    }

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      lots,
    });
  } catch (error) {
    console.log("Помилка при отриманні лотів:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const showAllLots = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows: lots } = await Lots.findAndCountAll({
      where: {
        status: "ended",
      },
      order: [["created_at", "DESC"]],
      limit,
      offset,
      attributes: ["id", "image_url", "title", "description"],
      include: [
        {
          model: Users,
          as: "creator",
          attributes: ["id", "name", "created_at"],
        },
      ],
    });

    if (lots.length === 0) {
      return res.status(404).json({ message: "Лоти не знайдено" });
    }

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      lots,
    });
  } catch (error) {
    console.log("Помилка при отриманні лотів:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = { showLots, showActiveLots, showAllLots };
