const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const JadwalAsesor = sequelize.define("jadwal_asesor", {
  id_jadwal: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  jenis_tugas: {
    type: DataTypes.ENUM(
      "asesor_penguji",
      "verifikator_tuk",
      "validator_mkva",
      "komite_teknis"
    ),
    primaryKey: true,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("aktif", "nonaktif"),
    defaultValue: "aktif"
  },
  catatan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  assigned_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "jadwal_asesor",
  timestamps: false
});

module.exports = JadwalAsesor;
