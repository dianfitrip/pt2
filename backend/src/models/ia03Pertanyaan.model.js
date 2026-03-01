const {DataTypes, BOOLEAN} = require ("sequelize");
const sequelize = require ("../config/database")

const IA03Pertanyaan = sequelize.define("ia03_pertanyaan", {
  id_ia03: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_unit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pertanyaan: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "ia03_pertanyaan",
  timestamps: false
});

module.exports = IA03Pertanyaan;
