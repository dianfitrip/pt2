const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProfileTuk = sequelize.define("profile_tuk", {
  id_user: { type: DataTypes.INTEGER, primaryKey: true },

  kode_tuk: { type: DataTypes.STRING(50), unique: true },
  nama_tuk: DataTypes.STRING(150),
  jenis_tuk: DataTypes.ENUM("mandiri","sewaktu","tempat_kerja"),
  penanggung_jawab: DataTypes.STRING(150),

  alamat: DataTypes.TEXT,
  provinsi: DataTypes.STRING(50),
  kota: DataTypes.STRING(50),
  kecamatan: DataTypes.STRING(50),
  kelurahan: DataTypes.STRING(50),
  rt: DataTypes.STRING(5),
  rw: DataTypes.STRING(5),
  kode_pos: DataTypes.STRING(10),

  telepon: DataTypes.STRING(20),
  email_tuk: DataTypes.STRING(100),

  institusi_induk: DataTypes.STRING(150),

  no_lisensi: DataTypes.STRING(100),
  masa_berlaku: DataTypes.DATE,

  status_tuk: {
    type: DataTypes.ENUM("aktif","nonaktif"),
    defaultValue: "aktif"
  },

  foto: DataTypes.STRING(255)
}, {
  tableName: "profile_tuk",
  timestamps: false
});

module.exports = ProfileTuk;
