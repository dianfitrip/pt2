const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UnitElemen = sequelize.define("unit_elemen", {
  id_elemen: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_unit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
    nama_elemen: {
    type: DataTypes.TEXT,
    allowNull: false
  },
    urutan: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "unit_elemen",
  timestamps: false
});

module.exports = UnitElemen;
