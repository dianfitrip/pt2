const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DokumenMutu = sequelize.define("dokumen_mutu", {
  id_dokumen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  jenis_dokumen: {
    type: DataTypes.ENUM(
      "kebijakan_mutu",
      "manual_mutu",
      "standar_mutu",
      "formulir_mutu",
      "referensi"
    ),
    allowNull: false
  },
  kategori: DataTypes.STRING(100),
  nama_dokumen: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  deskripsi: DataTypes.TEXT,
  nomor_dokumen: DataTypes.STRING(100),
  nomor_revisi: DataTypes.STRING(50),
  penyusun: DataTypes.STRING(150),
  disahkan_oleh: DataTypes.STRING(150),
  tanggal_dokumen: DataTypes.DATE,
  file_dokumen: DataTypes.STRING(255),
  file_pendukung: DataTypes.STRING(255),
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
}, {
  tableName: "dokumen_mutu",
  timestamps: false
});

module.exports = DokumenMutu;
