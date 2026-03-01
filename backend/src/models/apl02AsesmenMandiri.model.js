const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Apl02AsesmenMandiri = sequelize.define("apl02", {
  id_apl02: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_apl01: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_unit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  elemen_kompetensi: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: "Deskripsi lengkap Elemen Kompetensi dengan nomor dinamis"
  },
  kriteria_unjuk_kerja: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: "Deskripsi lengkap Kriteria Unjuk Kerja dengan nomor dinamis"
  },
  jawaban: {
    type: DataTypes.ENUM("k", "bk"),
    allowNull: false
  },
  jenis_pengalaman: {
    type: DataTypes.ENUM(
      "hasil_karya_atau_produk",
      "pengalaman_pembuatan_laporan",
      "pengalaman_magang",
      "pengalaman_menjadi_narasumber",
      "pengalaman_kerja",
      "pengalaman_pendidikan",
      "pengalaman_proyek",
      "pengalaman_studi_kasus"
    ),
    allowNull: false
  },
  nama_dokumen: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  nomor_dokumen: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tanggal_dokumen: {
    type: DataTypes.DATE,
    allowNull: true
  },
  file_bukti: {
    type: DataTypes.STRING(255), 
    allowNull: true
  },
  catatan_bukti: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "apl02",
  timestamps: false
});

module.exports = Apl02AsesmenMandiri;