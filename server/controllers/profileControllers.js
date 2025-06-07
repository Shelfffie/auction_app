const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { Users, Lots, Bids, Messages } = require("../models");

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

const deleteUserContr = async (req, res) => {
  const { status } = req.body;

  try {
    if (!status) {
      return res.status(400).json({ message: "Немає даних" });
    }

    const allowedStatuses = ["deleted"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Недопустимий статус" });
    }

    const user = await Users.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    if (user.status === "deleted" || user.status === "banned") {
      return res.status(400).json({ message: "Акаунт вже видалено" });
    }

    const targetLotIds = await Lots.findAll({
      where: {
        [Op.or]: [
          { status: "active" },
          { status: "ended", payment_status: "unpaid" },
        ],
      },
      attributes: ["id"],
    });

    const auctionIds = targetLotIds.map((lot) => lot.id);

    await Bids.destroy({
      where: {
        user_id: req.user.id,
        auction_id: {
          [Op.in]: auctionIds,
        },
      },
      force: true,
    });

    const lotsWithPaid = await Lots.findAll({
      where: { payment_status: "paid" },
      attributes: ["id"],
    });
    const paidAuctionIds = lotsWithPaid.map((lot) => lot.id);

    await Messages.destroy({
      where: {
        [Op.or]: [
          {
            sender_id: req.user.id,
            auction_id: {
              [Op.notIn]: paidAuctionIds,
            },
          },
          {
            receiver_id: req.user.id,
            auction_id: {
              [Op.notIn]: paidAuctionIds,
            },
          },
        ],
      },
      force: true,
    });

    await Lots.update(
      { status: "cancelled" },
      {
        where: {
          creator_id: req.user.id,
          [Op.or]: [
            { status: "active" },
            { status: "ended", payment_status: "unpaid" },
          ],
        },
      }
    );

    user.status = status;
    await user.save();
    res.json({ message: "Акаунт видалено", user });
  } catch (error) {
    console.error("Помилка при видаленні акаунту:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = { profileContr, deleteUserContr };
