const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BandingAsesmen = sequelize.define("banding_asesmen", {
  id_banding: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_jadwal: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  id_skema: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isi_banding: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status_progress: {
    type: DataTypes.ENUM(
      "diajukan",
      "tindak_lanjut",
      "pleno_komite",
      "selesai"
    ),
    defaultValue: "diajukan"
  },
  keputusan: {
    type: DataTypes.ENUM(
      "diterima",
      "ditolak",
      "belum_diputuskan"
    ),
    defaultValue: "belum_diputuskan"
  },
  catatan_komite: DataTypes.TEXT,
  tanggal_ajukan: DataTypes.DATE,
  tanggal_putusan: DataTypes.DATE
}, {
  tableName: "banding_asesmen",
  timestamps: false
});

module.exports = BandingAsesmen;
