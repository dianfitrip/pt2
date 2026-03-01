const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProfileAdmin = sequelize.define("profile_admin", {
  id_user: { type: DataTypes.INTEGER, primaryKey: true },
  nip_admin: DataTypes.STRING(20),
  nik: DataTypes.CHAR(16),
  nama_lengkap: DataTypes.STRING(150),
  tempat_lahir: DataTypes.STRING(50),
  tanggal_lahir: DataTypes.DATE,

  alamat: DataTypes.TEXT,
  provinsi: DataTypes.STRING(50),
  kota: DataTypes.STRING(50),
  kecamatan: DataTypes.STRING(50),
  kelurahan: DataTypes.STRING(50),
  rt: DataTypes.STRING(5),
  rw: DataTypes.STRING(5),

  pendidikan_terakhir: DataTypes.STRING(100),

  no_lisensi: DataTypes.STRING(50),
  masa_berlaku: DataTypes.DATE,

  foto: DataTypes.STRING(255)
}, {
  tableName: "profile_admin",
  timestamps: false
});

module.exports = ProfileAdmin;
