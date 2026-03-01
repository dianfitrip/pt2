const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Mapa = sequelize.define("mapa", {
  id_mapa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_skema: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  versi: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  jenis: {
    type : DataTypes.ENUM (
    "MAPA-01",
    "MAPA-02"
    ),
    allowNull : false
  },
  status: {
    type : DataTypes.ENUM (
    "draft",
    "final"
    ),
    defaultValue : "draft"
  },
  created_by: DataTypes.INTEGER,
  created_at: DataTypes.DATE
}, {
  tableName: "mapa",
  timestamps: false
});

module.exports = Mapa;
