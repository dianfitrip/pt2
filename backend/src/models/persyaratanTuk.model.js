const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PersyaratanTuk = sequelize.define("persyaratan_tuk", {
  id_persyaratan_tuk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_perlengkapan: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  spesifikasi: DataTypes.TEXT
}, {
  tableName: "persyaratan_tuk",
  timestamps: false
});

module.exports = PersyaratanTuk;
