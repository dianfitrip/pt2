const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UnitKuk = sequelize.define("unit_kuk", {
  id_kuk: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_elemen: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  kuk: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  urutan: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "unit_kuk",
  timestamps: false
});

module.exports = UnitKuk;
