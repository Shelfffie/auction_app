const { Sequelize } = require("sequelize");

const usersDb = new Sequelize("auction-db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

module.exports = usersDb;
