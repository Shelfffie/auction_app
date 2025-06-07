const cron = require("node-cron");
const { Users, Lots, Bids, Messages } = require("../");
const { Op } = require("sequelize");

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Перевірка аукціонів..");
    const now = new Date();

    const lots = await Lots.findAll({
      where: {
        status: "ended",
        payment_status: "unpaid",
        end_time: {
          [Op.lt]: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const activeAuctions = await Lots.findAll({
      where: {
        status: "active",
      },
    });
    const activeAuctionIds = activeAuctions.map((a) => a.id);

    for (const lot of lots) {
      const latestBid = await Bids.findOne({
        where: { auction_id: lot.id },
        order: [["created_at", "DESC"]],
      });

      if (latestBid) {
        const userId = latestBid.user_id;

        await Users.update({ status: "banned" }, { where: { id: userId } });

        await Bids.destroy({ where: { auction_id: lot.id, user_id: userId } });

        if (activeAuctionIds.length > 0) {
          await Bids.destroy({
            where: {
              auction_id: { [Op.in]: activeAuctionIds },
              user_id: userId,
            },
          });
        }
        await Messages.destroy({
          where: {
            auction_id: lot.id,
          },
        });

        lot.status = "cancelled";
        await lot.save();

        console.log(`Лот #${lot.id} скасовано, користувача забанено.`);
      }
    }
  } catch (error) {
    console.log("Помилка при оновленні:", error);
  }
});
