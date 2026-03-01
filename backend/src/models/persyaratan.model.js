const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Persyaratan = sequelize.define("persyaratan", {
  id_persyaratan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_persyaratan: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  jenis_persyaratan: {
    type: DataTypes.ENUM("dasar", "administratif"),
    allowNull: false
  },
  keterangan: DataTypes.TEXT
}, {
  tableName: "persyaratan",
  timestamps: false
});

module.exports = Persyaratan;
