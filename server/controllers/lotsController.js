const { Lots, Users } = require("../models");

const LotContrl = async (req, res) => {
  const { title, description, start_price, start_time, end_time } = req.body;
  const creator_id = req.user.id;
  const imageFile = req.file;
  try {
    if (
      !title ||
      !description ||
      !imageFile ||
      !start_price ||
      !start_time ||
      !end_time ||
      !creator_id
    ) {
      return res.status(400).json({ message: "All fields must be filled." });
    }

    const image_url = "/uploads/" + imageFile.filename;

    await Lots.create({
      title,
      description,
      image_url,
      start_price,
      start_time,
      end_time,
      creator_id,
    });
    res.status(201).json({ message: "Creation successful!" });
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

module.exports = { LotContrl, IdLots };
