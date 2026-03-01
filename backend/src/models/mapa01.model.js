const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Mapa01 = sequelize.define("mapa01", {
  id_mapa01: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_mapa: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  profil_asesi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tujuan_asesmen: {
    type : DataTypes.ENUM (
    "sertifikasi",
    "sertifikasi_ulang",
    "pkt",
    "rpl",
    "lainnya"
    ),
    allowNull : true
  },
  lingkungan: {
    type : DataTypes.ENUM (
    "tempat_kerja_nyata",
    "tempat_kerja_simulasi"
    )
  },
  peluang_bukti: {
    type : DataTypes.ENUM (
    "tersedia",
    "terbatas"
    )
  },
  pelaksana: {
    type : DataTypes.ENUM (
    "lsp",
    "organisasi_pelatihan",
    "asesor_perusahaan"
    )
  }
}, {
  tableName: "mapa01",
  timestamps: false
});

module.exports = Mapa01;
