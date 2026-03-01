const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PendaftaranAsesi = sequelize.define("pendaftaran_asesi", {
  id_pendaftaran: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nik: DataTypes.CHAR(16),
  nama_lengkap: DataTypes.STRING(100),
  email: DataTypes.STRING(100),
  no_hp: DataTypes.STRING(20),
  alamat_lengkap: DataTypes.STRING(255),
  provinsi: DataTypes.STRING(50),
  kota: DataTypes.STRING(50),
  kecamatan: DataTypes.STRING(50),
  kelurahan: DataTypes.STRING(50),
  wilayah_rji: DataTypes.STRING(100),
  program_studi: DataTypes.STRING(100),
  kompetensi_keahlian: DataTypes.STRING(100),
  status: {
  type: DataTypes.ENUM("pending", "approved", "rejected"),
  defaultValue: "pending"
  },
  tanggal_daftar: DataTypes.DATE
}, {
  tableName: "pendaftaran_asesi",
  timestamps: false
});

module.exports = PendaftaranAsesi;
