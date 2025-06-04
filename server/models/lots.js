const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd-config.js");

const Lots = sequelize.define(
  "Lots",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    start_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "active", "ended", "cancelled"),
      allowNull: true,
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    payment_status: {
      type: DataTypes.ENUM("paid", "unpaid"),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "auctions",
    timestamps: false,
    underscored: true,
  }
);

module.exports = { Lots };
