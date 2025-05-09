const cron = require("node-cron");
const { Lots } = require("../lots");
const { Op } = require("sequelize");

cron.schedule("*/1 * * * *", async () => {
  const now = new Date();

  try {
    await Lots.update(
      { status: "active" },
      {
        where: {
          start_time: { [Op.lte]: now },
          end_time: { [Op.gte]: now },
          status: { [Op.ne]: "cancelled" },
        },
      }
    );

    await Lots.update(
      { status: "ended" },
      {
        where: {
          end_time: { [Op.lt]: now },
          status: { [Op.ne]: "cancelled" },
        },
      }
    );

    await Lots.update(
      { status: "on_hold" },
      {
        where: {
          start_time: { [Op.gt]: now },
          status: { [Op.ne]: "cancelled" },
        },
      }
    );
    console.log("Статуси аукціонів оновлено:", new Date().toLocaleString());
  } catch (error) {
    console.error("Помилка при оновленні статусів:", error);
  }
});
