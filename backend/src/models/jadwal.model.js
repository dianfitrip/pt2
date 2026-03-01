const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Jadwal = sequelize.define("jadwal", {
  id_jadwal: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kode_jadwal: DataTypes.STRING(50),
  id_skema: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_tuk: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nama_kegiatan: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  tahun: DataTypes.INTEGER,
  periode_bulan: DataTypes.STRING(20),
  gelombang: DataTypes.STRING(20),
  tgl_pra_asesmen: DataTypes.DATEONLY,
  tgl_awal: DataTypes.DATEONLY,
  tgl_akhir: DataTypes.DATEONLY,
  jam: DataTypes.TIME,
  kuota: DataTypes.INTEGER,
  pelaksanaan_uji: DataTypes.ENUM("luring","daring","hybrid","onsite"),
  url_agenda: DataTypes.STRING(255),
  status: {
    type: DataTypes.ENUM("draft","open","ongoing","selesai","arsip"),
    defaultValue: "draft"
  },
  created_by: DataTypes.INTEGER,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
}, {
  tableName: "jadwal",
  timestamps: false
});

module.exports = Jadwal;
