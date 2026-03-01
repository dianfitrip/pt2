const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FrAk01 = sequelize.define('FrAk01', {
  id_fr_ak_01: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_peserta_jadwal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_asesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  // Skema
  skema_judul: DataTypes.STRING(255),
  skema_nomor: DataTypes.STRING(50),
  skema_jenis: DataTypes.ENUM('klaster', 'kkni', 'okupasi'),

  // TUK
  tuk_nama: DataTypes.STRING(255),
  tuk_jenis: DataTypes.ENUM('mandiri', 'sewaktu', 'tempat_kerja'),

  // Nama
  nama_asesor: DataTypes.TEXT,
  nama_asesi: DataTypes.STRING(150),

  // Pelaksanaan
  hari_tanggal: DataTypes.DATEONLY,
  waktu_mulai: DataTypes.TIME,
  tempat_pelaksanaan: DataTypes.STRING(255),

  // Bukti
  bukti_portfolio: DataTypes.TINYINT(1),
  bukti_reviu_produk: DataTypes.TINYINT(1),
  bukti_observasi_langsung: DataTypes.TINYINT(1),
  bukti_keg_terstruktur: DataTypes.TINYINT(1),
  bukti_pertanyaan_tulis: DataTypes.TINYINT(1),
  bukti_pertanyaan_lisan: DataTypes.TINYINT(1),
  bukti_pertanyaan_wawancara: DataTypes.TINYINT(1),
  bukti_lainnya: DataTypes.TEXT,

  // Pernyataan
  pernyataan_kerahasiaan: DataTypes.TINYINT(1),

  // Status TTD
  status_ttd_asesor: DataTypes.ENUM('draft', 'signed'),

  // Timestamp
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'fr_ak_01',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = FrAk01;