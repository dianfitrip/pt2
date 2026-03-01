const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Tuk = sequelize.define("tuk", {
  id_tuk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kode_tuk: DataTypes.STRING(50),
  nama_tuk: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  jenis_tuk: DataTypes.ENUM("mandiri", "sewaktu", "tempat_kerja"),
  penanggung_jawab: DataTypes.STRING(150),
  institusi_induk: DataTypes.STRING(150),
  telepon: DataTypes.STRING(20),
  email: DataTypes.STRING(100),
  alamat: DataTypes.TEXT,
  provinsi: DataTypes.STRING(50),
  kota: DataTypes.STRING(50),
  kecamatan: DataTypes.STRING(50),
  kelurahan: DataTypes.STRING(50),
  kode_pos: DataTypes.STRING(10),
  no_lisensi: DataTypes.STRING(100),
  masa_berlaku_lisensi: DataTypes.DATE,
  status: {
    type: DataTypes.ENUM("aktif", "nonaktif"),
    defaultValue: "aktif"
  }
}, {
  tableName: "tuk",
  timestamps: false
});

module.exports = Tuk;
