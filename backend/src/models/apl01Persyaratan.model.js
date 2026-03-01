const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Apl01Persyaratan = sequelize.define("apl01_persyaratan", {
  id_apl01: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_persyaratan: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  status_memenuhi: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: "apl01_persyaratan",
  timestamps: false
});

module.exports = Apl01Persyaratan;