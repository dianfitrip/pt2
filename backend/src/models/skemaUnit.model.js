const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SkemaUnit = sequelize.define("skema_unit", {
  id_skema: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_unit: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  urutan: DataTypes.INTEGER
}, {
  tableName: "skema_unit",
  timestamps: false
});

module.exports = SkemaUnit;
