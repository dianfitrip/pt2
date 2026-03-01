const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const KelompokPekerjaan = sequelize.define("kelompok_pekerjaan", {
  id_kelompok: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_skema: DataTypes.INTEGER,
  nama_kelompok: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  deskripsi: DataTypes.TEXT,
  urutan: DataTypes.INTEGER
}, {
  tableName: "kelompok_pekerjaan",
  timestamps: false
});

module.exports = KelompokPekerjaan;
