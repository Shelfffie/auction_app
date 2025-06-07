const { Lots, Users, Bids } = require("../models");

const LotContrl = async (req, res) => {
  const { title, description, start_price, start_time, end_time } = req.body;
  const creator_id = req.user.id;
  const imageFile = req.file;
  try {
    const user = await Users.findByPk(creator_id);

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    if (user.role !== "admin" && user.role !== "organizer") {
      return res.status(403).json({ message: "Немає прав на створення лотів" });
    }

    if (
      !title ||
      !description ||
      !imageFile ||
      !start_price ||
      !start_time ||
      !end_time ||
      !creator_id
    ) {
      return res
        .status(400)
        .json({ message: "Всі поля повинні бути заповнені." });
    }

    const image_url = "/uploads/" + imageFile.filename;

    const newLot = await Lots.create({
      title,
      description,
      image_url,
      start_price,
      start_time,
      end_time,
      creator_id,
    });

    res.status(201).json({ message: "Лот успішно створено!", id: newLot.id });
  } catch (error) {
    console.error("Creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const IdLots = async (req, res) => {
  try {
    const lotId = req.params.id;
    const lot = await Lots.findByPk(lotId, {
      attributes: [
        "id",
        "image_url",
        "title",
        "description",
        "start_price",
        "start_time",
        "end_time",
        "created_at",
        "status",
        "payment_status",
      ],
      include: [
        {
          model: Users,
          as: "creator",
          attributes: ["id", "name", "created_at"],
        },
      ],
    });

    if (!lot) {
      return res.status(404).json({ message: "Лот не знайдено" });
    }

    res.json({
      id: lot.id,
      image_url: lot.image_url,
      title: lot.title,
      description: lot.description,
      start_price: lot.start_price,
      start_time: lot.start_time,
      end_time: lot.end_time,
      created_at: lot.created_at,
      status: lot.status,
      payment_status: lot.payment_status,
      creator: lot.creator
        ? {
            userId: lot.creator.id,
            name: lot.creator.name,
            user_created: lot.creator.created_at,
          }
        : null,
    });
  } catch (error) {
    console.log("Помилка:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const editLotContrl = async (req, res) => {
  const fieldForEditing = [
    "title",
    "description",
    "image_url",
    "start_price",
    "start_time",
    "end_time",
  ];

  const updates = {};

  for (const field of fieldForEditing) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (req.file) {
    updates.image_url = "/uploads/" + req.file.filename;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Немає даних для оновлення" });
  }
  try {
    const lot = await Lots.findByPk(req.params.id);

    if (!lot) return res.status(404).json({ message: "Лот не знайдено" });

    console.log("USER:", req.user);
    console.log("LOT:", lot.creator_id);

    if (req.user.role !== "admin" && req.user.id !== lot.creator_id) {
      return res
        .status(403)
        .json({ message: "Немає прав на редагування цього лоту" });
    }

    if (lot.status === "ended" && req.user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "Лот завершено — редагування заборонено" });
    }

    Object.assign(lot, updates);
    await lot.save();

    res.json(lot);
  } catch (error) {
    console.error("Помилка оновлення лоту", error);
    res.status(500).json({ message: "Помилка серверу" });
  }
};

const editLotStatus = async (req, res) => {
  const { id } = req.params;
  const { status, start_time, end_time } = req.body;

  try {
    const lot = await Lots.findByPk(id);

    if (!lot) {
      return res.status(404).json({ message: "Лот не знайдено" });
    }
    if (req.user.role !== "admin" && req.user.id !== lot.creator_id) {
      return res.status(403).json({ message: "Немає прав на зміну статусу" });
    }
    if (lot.status === "ended" && req.user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "Лот завершено — редагування заборонено" });
    }
    lot.status = status;
    lot.start_time = start_time || lot.start_time;
    lot.end_time = end_time || lot.end_time;
    await lot.save();

    res.json(lot);
  } catch (err) {
    console.error("Помилка:", err);
    res.status(500).json({ message: "Помилка оновлення статусу" });
  }
};

const delLotCntrl = async (req, res) => {
  const { id } = req.params;

  try {
    const lot = await Lots.findByPk(id);

    if (!lot) {
      return res.status(404).json({ message: "Лот не знайдено" });
    }

    if (req.user.role !== "admin" && req.user.id !== lot.creator_id) {
      return res.status(403).json({ message: "Немає прав видалити цей лот" });
    }

    await lot.destroy();
    res.status(200).json({ message: "Лот успішно видалено" });
  } catch (error) {
    console.error("Помилка при видаленні лоту:", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

const payLotController = async (req, res) => {
  const { id } = req.params;
  const { amount, fundId } = req.body;
  const userId = req.user?.id;

  try {
    const lot = await Lots.findByPk(id);

    if (!lot) {
      return res.status(404).json({ message: "Лот не знайдено" });
    }

    if (lot.payment_status === "paid") {
      return res.status(400).json({ message: "Лот уже оплачений" });
    }

    const lastBid = await Bids.findOne({
      where: { auction_id: id },
      order: [["created_at", "DESC"]],
    });

    if (!lastBid || lastBid.user_id !== userId) {
      return res.status(403).json({ message: "Ви не є переможцем лоту" });
    }

    lot.payment_status = "paid";
    await lot.save();

    res.status(200).json({ message: "Оплата успішна", lot });
  } catch (error) {
    console.error("Помилка оплати:", error);
    res.status(500).json({ message: "Помилка сервера при оплаті" });
  }
};

module.exports = {
  LotContrl,
  IdLots,
  editLotContrl,
  editLotStatus,
  delLotCntrl,
  payLotController,
};
