const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Mapa02Metode = sequelize.define("mapa02_metode", {
  id_metode: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_mapping: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  metode: {
    type: DataTypes.ENUM (
    "IA01",
    "IA02",
    "IA03",
    "IA04A",
    "IA04B",
    "IA05",
    "IA06",
    "IA07",
    "IA09"
    ),
    allowNull: false
  },
  digunakan: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "mapa02_metode",
  timestamps: false
});

module.exports = Mapa02Metode;
