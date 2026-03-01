const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UnitKompetensi = sequelize.define("unit_kompetensi", {
  id_unit: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_skkni: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  kode_unit: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  judul_unit: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: "unit_kompetensi",
  timestamps: false
});

module.exports = UnitKompetensi;