const {DataTypes} = require ("sequelize");
const sequelize = require ("../config/database")

const BankSoalPG = sequelize.define("bank_soal_pg", {
  id_opsi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_soal: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  opsi_label: {
    type: DataTypes.STRING(1),
    allowNull: false
  },
  isi_opsi: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_benar: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: "bank_soal_pg_opsi",
  timestamps: false
});

module.exports = BankSoalPG;
