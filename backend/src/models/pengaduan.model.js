const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pengaduan = sequelize.define("pengaduan", {
  id_pengaduan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama_pengadu: DataTypes.STRING(100),
  email_pengadu: DataTypes.STRING(100),
  no_hp_pengadu: DataTypes.STRING(20),
  sebagai_siapa: DataTypes.ENUM("asesi","asesor","masyarakat"),
  isi_pengaduan: DataTypes.TEXT,
  tanggal_pengaduan: DataTypes.DATE,
  status_pengaduan: {
    type: DataTypes.ENUM("masuk","tindak_lanjut","selesai"),
    defaultValue: "masuk"
  }
}, {
  tableName: "pengaduan",
  timestamps: false
});

module.exports = Pengaduan;
