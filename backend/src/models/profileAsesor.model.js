const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProfileAsesor = sequelize.define("profile_asesor", {
  id_user: { type: DataTypes.INTEGER, primaryKey: true },
  nik: { type: DataTypes.CHAR(16), unique: true },
  gelar_depan: DataTypes.STRING(30),
  nama_lengkap: DataTypes.STRING(150),
  gelar_belakang: DataTypes.STRING(30),
  jenis_kelamin: DataTypes.ENUM("laki-laki","perempuan"),
  tempat_lahir: DataTypes.STRING(50),
  tanggal_lahir: DataTypes.DATE,
  kebangsaan: DataTypes.STRING(50),

  pendidikan_terakhir: DataTypes.STRING(100),
  tahun_lulus: DataTypes.INTEGER,
  institut_asal: DataTypes.STRING(150),

  alamat: DataTypes.TEXT,
  rt: DataTypes.STRING(5),
  rw: DataTypes.STRING(5),
  provinsi: DataTypes.STRING(50),
  kota: DataTypes.STRING(50),
  kecamatan: DataTypes.STRING(50),
  kelurahan: DataTypes.STRING(50),
  kode_pos: DataTypes.STRING(10),

  bidang_keahlian: DataTypes.STRING(150),

  no_reg_asesor: DataTypes.STRING(50),
  no_lisensi: DataTypes.STRING(50),
  masa_berlaku: DataTypes.DATE,

  status_asesor: DataTypes.ENUM("aktif","nonaktif"),

  ttd_path: DataTypes.STRING(255)
}, {
  tableName: "profile_asesor",
  timestamps: false
});

module.exports = ProfileAsesor;