const { DataTypes } = require("sequelize");
const sequelize = require("../config/users-config.js");

const Requests = sequelize.define(
  "VerificationRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "full_name",
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "birth_date",
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    passport_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    selfie_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "VerificationRequests",
    timestamps: false,
    underscored: true,
  }
);

module.exports = { Requests };
