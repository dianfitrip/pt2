const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SkemaPersyaratan = sequelize.define("skema_persyaratan", {
  id_skema: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_persyaratan: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  wajib: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "skema_persyaratan",
  timestamps: false
});

module.exports = SkemaPersyaratan;
