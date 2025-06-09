const { Lots, Users, Bids } = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const showCreatedLots = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows: lots } = await Lots.findAndCountAll({
      where: { creator_id: userId },
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

const showBidsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const userBids = await Bids.findAll({
      where: { user_id: userId },
      attributes: ["auction_id"],
      group: ["auction_id"],
    });

    const auctionIds = userBids.map((bid) => bid.auction_id);

    if (auctionIds.length.length === 0) {
      return res.status(404).json({ message: "Лоти не знайдено" });
    }

    const { count, rows: lots } = await Lots.findAndCountAll({
      where: {
        status: "active",
        id: {
          [Op.in]: auctionIds,
        },
      },
      order: [["end_time", "DESC"]],
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
      ],
      include: [
        {
          model: Users,
          as: "creator",
          attributes: ["id", "name", "created_at", "profile_icon"],
        },
        {
          model: Bids,
          as: "bids",
          limit: 1,
          separate: true,
          order: [["created_at", "DESC"]],
          attributes: ["id", "amount", "user_id", "created_at"],
          include: [
            {
              model: Users,
              as: "user_bid",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

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

module.exports = { showCreatedLots, showBidsById };
