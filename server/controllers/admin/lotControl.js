const jwt = require("jsonwebtoken");
const { Lots } = require("../../models");

const GetlotInfo = async (req, res) => {
  try {
    const lotId = req.params.id;
    const lot = await Lots.findByPk(lotId, {
      attributes: [
        "id",
        "title",
        "description",
        "start_price",
        "start_time",
        "end_time",
        "creator_id",
        "status",
        "created_at",
        "updated_at",
      ],
    });

    if (!lot) {
      return res.status(404).json({ message: "Лот не знайдено" });
    }

    res.json({ lot });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

const editlotControl = async (req, res) => {
  const fieldForEditing = [
    "title",
    "description",
    "start_price",
    "start_time",
    "end_time",
    "status",
  ];

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
    const lot = await Lots.findByPk(req.params.id);

    if (!lot) {
      return res.status(404).json({ message: "Лот не знайдено" });
    }

    Object.assign(lot, updates);
    await lot.save();

    res.json(lot);
  } catch (error) {
    console.error("Помилка оновлення", error);
    res.status(500).json({ message: "Помилка серверу" });
  }
};

const deletlotControl = async (req, res) => {
  const lotId = req.params.id;

  try {
    const lot = await Lots.findByPk(lotId);

    if (!lot) {
      return res.status(404).json({ message: "Лот не знайдено" });
    }

    await lot.destroy();
    res.status(200).json({ message: "Лот видалено" });
  } catch (error) {
    console.error("Помилка при видаленні,", error);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

module.exports = { GetlotInfo, editlotControl, deletlotControl };
