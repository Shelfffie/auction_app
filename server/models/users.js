const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd-config.js");

const Users = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    profile_icon: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "/icons/null-icon.jpg",
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "organizer", "admin"),
      defaultValue: "user",
    },
    status: {
      type: DataTypes.ENUM("unverified", "active", "deleted", "banned"),
      defaultValue: "unverified",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored: true,
  }
);

module.exports = { Users };
