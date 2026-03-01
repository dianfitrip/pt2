const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TukSkema = sequelize.define("tuk_skema", {
  id_tuk: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_skema: {
    type: DataTypes.INTEGER,
    primaryKey: true
  }
}, {
  tableName: "tuk_skema",
  timestamps: false
});

module.exports = TukSkema;
