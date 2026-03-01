const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Apl01Unit = sequelize.define("apl01_unit", {
  id_apl01: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_unit: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: "apl01_unit",
  timestamps: false
});

module.exports = Apl01Unit;