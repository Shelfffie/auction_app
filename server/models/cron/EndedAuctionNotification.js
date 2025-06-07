const { Lots, Users, Bids } = require("../");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNotification = async () => {
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

  const endedLots = await Lots.findAll({
    where: {
      end_time: {
        [Op.between]: [oneMinuteAgo, now],
      },
      status: { [Op.ne]: "cancelled" },
      payment_status: { [Op.is]: null },
    },
    attributes: ["id", "title"],
  });

  if (endedLots.length === 0) {
    return;
  }

  const lotIds = endedLots.map((lot) => lot.id);

  const bidders = await Bids.findAll({
    where: { auction_id: lotIds },
    include: [
      {
        model: Users,
        as: "user_bid",
        attributes: ["email", "name"],
      },
      {
        model: Lots,
        as: "lot_owner",
        attributes: ["title"],
      },
    ],
  });

  if (bidders.length === 0) {
    console.log("Нема учасників ставок для завершених лотів");
    return;
  }

  const sentEmails = new Set();
  for (const bid of bidders) {
    const email = bid.user_bid.email;
    if (sentEmails.has(email)) continue;
    sentEmails.add(email);

    const userName = bid.user_bid.name;
    const lotTitle = bid.lot_owner.title;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Аукціон "${lotTitle}" завершено`,
        text: `Привіт, ${userName}!\n\nАукціон "${lotTitle}", у якому ви брали участь, завершено. Перевірте результат! \nДякуємо за вашу активність!\n\nЗ повагою,\nDonutOn.`,
      });
      console.log(`Email надіслано: ${email}`);
    } catch (error) {
      console.error(`Помилка при відправці листа на ${email}:`, error);
    }
  }
};

module.exports = { sendNotification };
