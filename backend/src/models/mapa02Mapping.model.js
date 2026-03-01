const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Mapa02Mapping = sequelize.define("mapa02_mapping", {
  id_mapping: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_mapa: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_unit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_kelompok: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "mapa02_mapping",
  timestamps: false
});

module.exports = Mapa02Mapping;
