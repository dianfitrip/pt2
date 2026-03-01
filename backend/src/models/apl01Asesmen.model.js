const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Apl01Asesmen = sequelize.define("apl01_asesmen", {
  id_apl01: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_skema: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_jadwal: {
  type: DataTypes.INTEGER,
  allowNull: true
  },
  dokumen_tambahan: {
    type: DataTypes.JSON, 
    allowNull: true
  },
  tujuan_asesmen: {
    type: DataTypes.ENUM("sertifikasi", "sertifikasi_ulang", "pengakuan_kompetensi_terkini", "rekognisi_pembelajaran_lampau", "lainnya"),
    allowNull: false
  },
  tujuan_asesmen_lainnya: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  tanda_tangan: {
    type: DataTypes.STRING(255), 
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("draft", "submitted", "approved", "rejected"),
    defaultValue: "draft"
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "apl01",
  timestamps: false
});

module.exports = Apl01Asesmen;