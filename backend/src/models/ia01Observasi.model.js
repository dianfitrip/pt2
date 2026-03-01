const {DataTypes} = require ("sequelize");
const sequelize = require ("../config/database")

const IA01Observasi = sequelize.define("ia01_observasi", {
  id_observasi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_unit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_kuk: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  elemen: DataTypes.TEXT,
  kuk: DataTypes.TEXT,
  urutan: DataTypes.INTEGER,
}, {
  tableName: "ia01_observasi",
  timestamps: false
});

module.exports = IA01Observasi;
