const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FrAk05 = sequelize.define('FrAk05', {
  id_fr_ak_05: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_peserta: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_jadwal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_skema: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_tuk: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_asesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_asesi: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  kode_skema: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  judul_skema: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  jenis_skema: {
    type: DataTypes.ENUM('klaster', 'kkni', 'okupasi'),
    allowNull: true,
  },
  nama_tuk: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  jenis_tuk: {
    type: DataTypes.ENUM('mandiri', 'sewaktu', 'tempat_kerja'),
    allowNull: true,
  },
  nama_asesor: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  no_reg_asesor: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  nama_asesi: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  nik_asesi: {
    type: DataTypes.CHAR(16),
    allowNull: true,
  },
  rekomendasi_unit: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  aspek_positif: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  aspek_negatif: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  penolakan_hasil: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  saran_perbaikan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ttd_asesor_path: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'fr_ak_05',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = FrAk05;