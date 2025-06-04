const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { Users } = require("../models");

const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Всі поля мають бути заповнені." });
    }

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Такий користувач вже існує." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await Users.create({
      email,
      password_hash: hashedPassword,
      name,
      status: "unverified",
    });

    const emailToken = jwt.sign(
      { userId: createdUser.id },
      process.env.EMAIL_SECRET,
      { expiresIn: "1h" }
    );

    const verificationUrl = `http://localhost:5173/verify-email?token=${emailToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"DonutOn" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Підтвердження електронної пошти",
      html: `<p>Натисни <a href="${verificationUrl}">тут</a>, щоб підтвердити свою електронну пошту.</p>`,
    });

    res
      .status(201)
      .json({ message: "Реєстрація успішна! Перевір свою пошту." });
  } catch (error) {
    console.error("Помилка реєстрації:", error);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Невірний email" });
    }

    if (user.status === "unverified") {
      return res.status(403).json({ message: "Пошта не підтверджена" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Невірний пароль" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, status: user.status },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res
      .status(200)
      .json({ message: "Вхід успішний", userId: user.id, token: token });
  } catch (error) {
    console.error("Помилка:", error);
    res.status(500).json({ message: "Помилка серверу:", error: error.message });
  }
};

module.exports = { registerUser, loginUser };
