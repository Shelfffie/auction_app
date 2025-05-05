const bcrypt = require("bcrypt");
const { Users } = require("../models/users");

const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields must be filled." });
    }

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "This user already exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.create({ email, password_hash: hashedPassword, name });

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser };
