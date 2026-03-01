// frAk02.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FrAk02 = sequelize.define('FrAk02', {
  id_fr_ak_02: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_fr_ak_02'
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
  id_user_asesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nama_asesi: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  nama_asesor: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  skema_sertifikasi: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  tanggal_mulai: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tanggal_selesai: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  unit_kompetensi: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  rekomendasi_hasil: {
    type: DataTypes.ENUM('kompeten', 'belum_kompeten'),
    allowNull: false,
  },
  tindak_lanjut: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  komentar_asesor: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ttd_asesor_confirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  ttd_asesor_confirmed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'fr_ak_02',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = FrAk02;