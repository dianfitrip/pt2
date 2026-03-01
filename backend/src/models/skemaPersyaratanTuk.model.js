const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SkemaPersyaratanTuk = sequelize.define("skema_persyaratan_tuk", {
  id_skema: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_persyaratan_tuk: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: "skema_persyaratan_tuk",
  timestamps: false
});

module.exports = SkemaPersyaratanTuk;
