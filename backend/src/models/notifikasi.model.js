const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notifikasi = sequelize.define("notifikasi", {
  id_notifikasi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  channel: {
    type: DataTypes.ENUM("email", "wa"),
    allowNull: false
  },
  tujuan: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  pesan: DataTypes.TEXT,
  waktu_kirim: DataTypes.DATE,
  status_kirim: {
    type: DataTypes.ENUM("terkirim", "gagal"),
    allowNull: false
  },
  ref_type: {
    type: DataTypes.ENUM("pendaftaran", "pengaduan", "akun"),
    allowNull: false
  },
  ref_id: DataTypes.INTEGER
}, {
  tableName: "notifikasi",
  timestamps: false
});

module.exports = Notifikasi;