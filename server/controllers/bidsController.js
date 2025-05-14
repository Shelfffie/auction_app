const { Lots, Users, Bids } = require("../models");

const addBid = async (req, res) => {
  const { id } = req.params;
  const { user_id, auction_id, amount } = req.body;

  try {
    const lot = await Lots.findByPk(id);
    if (!lot || lot.status !== "active") {
      return res.status(400).json({ message: "Аукціон не активний" });
    }

    if (Number(user_id) === Number(lot.user_id)) {
      return res
        .status(403)
        .json({ message: "Ви не можете робити ставки на власний лот." });
    }

    const newBid = await Bids.create({ user_id, auction_id: id, amount });

    const bidWithUser = await Bids.findOne({
      where: { id: newBid.id },
      include: [{ model: Users, attributes: ["name"], as: "user_bid" }],
    });

    const io = req.app.get("io");
    io.to(id).emit("newBid", bidWithUser);
    res.status(201).json(bidWithUser);
  } catch (error) {
    console.error("Помилка створення ставки:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const getBiddsByAuction = async (req, res) => {
  try {
    const bids = await Bids.findAll({
      where: { auction_id: req.params.id },
      order: [["created_at"]],
      include: [{ model: Users, attributes: ["name"], as: "user_bid" }],
    });
    res.json(bids);
  } catch (error) {
    console.error("Помилка отримання ставок:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = { addBid, getBiddsByAuction };
