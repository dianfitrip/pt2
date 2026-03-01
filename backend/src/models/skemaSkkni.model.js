const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SkemaSkkni = sequelize.define("skema_skkni", {
  id_skema: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_skkni: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: "skema_skkni",
  timestamps: false
});

module.exports = SkemaSkkni;
