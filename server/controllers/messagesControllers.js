const { Lots, Users, Bids, Messages } = require("../models");

const sendMessage = async (req, res) => {
  try {
    const { auction_id, receiver_id, message } = req.body;
    const lot = await Lots.findByPk(auction_id);
    const highestBid = await Bids.findOne({
      where: { auction_id },
      order: [["amount", "DESC"]],
    });

    if (!lot || !highestBid) {
      return res.status(404).json({ message: "Лот або ставка не знайдені" });
    }

    const isCreator = req.user.id === lot.creator_id;
    const isWinner = req.user.id === highestBid.user_id;

    if (!isCreator && !isWinner) {
      return res
        .status(403)
        .json({ message: "Немає прав на надсилання повідомлень." });
    }

    const newMessage = await Messages.create({
      auction_id,
      sender_id: req.user.id,
      receiver_id,
      message,
    });

    const io = req.app.get("io");
    io.to(String(auction_id)).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Помилка відправки повідомлення:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const getMessage = async (req, res) => {
  try {
    const { auction_id } = req.params;

    const lot = await Lots.findByPk(auction_id);
    const highestBid = await Bids.findOne({
      where: { auction_id },
      order: [["amount", "DESC"]],
    });

    if (!lot || !highestBid) {
      return res.status(404).json({ message: "Лот або ставка не знайдені" });
    }

    const isCreator = req.user.id === lot.creator_id;
    const isWinner = req.user.id === highestBid.user_id;

    if (!isCreator && !isWinner) {
      return res
        .status(403)
        .json({ message: "Немає прав перегляд повідомлень." });
    }

    const messages = await Messages.findAll({
      where: { auction_id },
      order: [["created_at", "ASC"]],
    });
    res.json(messages);
  } catch (error) {
    console.error("Помилка отримання повідомлень:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = { sendMessage, getMessage };
