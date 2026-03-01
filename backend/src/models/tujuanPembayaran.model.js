const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TujuanPembayaran = sequelize.define("tujuan_pembayaran", {
  id_tujuan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_tujuan: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  nomor_rekening: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  bank: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("aktif", "nonaktif"),
    defaultValue: "aktif"
  }
}, {
  tableName: "tujuan_pembayaran",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"

});

module.exports = TujuanPembayaran;