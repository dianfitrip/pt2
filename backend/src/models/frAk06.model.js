const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FrAk06 = sequelize.define('FrAk06', {
  id_fr_ak_06: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_jadwal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_user: {
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
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  
  rencana_validitas: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rencana_reliabel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rencana_fleksibel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rencana_adil: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  persiapan_validitas: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  persiapan_reliabel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  persiapan_fleksibel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  persiapan_adil: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
  implementasi_validitas: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  implementasi_reliabel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  implementasi_fleksibel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  implementasi_adil: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
  keputusan_validitas: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  keputusan_reliabel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  keputusan_fleksibel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  keputusan_adil: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
  umpan_balik_validitas: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  umpan_balik_reliabel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  umpan_balik_fleksibel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  umpan_balik_adil: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
  rekomendasi_peningkatan1: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  konsistensi_task_skills: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  konsistensi_task_management_skills: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  konsistensi_contingency_management_skills: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  konsistensi_job_role_environment_skills: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  konsistensi_transfer_skills: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
  detail_konsistensi_task_skills: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  detail_konsistensi_task_management_skills: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  detail_konsistensi_contingency_management_skills: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  detail_konsistensi_job_role_environment_skills: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  detail_konsistensi_transfer_skills: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  rekomendasi_peningkatan2: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  komentar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  ttd_path: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'fr_ak_06',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = FrAk06;