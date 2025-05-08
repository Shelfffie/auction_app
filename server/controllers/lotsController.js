const { Lots } = require("../models/lots");

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

    const image_url = "/images/" + imageFile.filename;

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

module.exports = { LotContrl };
