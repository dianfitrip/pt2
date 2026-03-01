const {DataTypes} = require ("sequelize");
const sequelize = require ("../config/database")

const BankSoal = sequelize.define("bank_soal", {
  id_soal: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_unit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  jenis: {
    type: DataTypes.ENUM(
    "IA05_pg",
    "IA06_essay",
    "IA07_lisan",
    "IA09_wawancara"
    ),
    allowNull: false
  },
    pertanyaan: {
    type: DataTypes.TEXT,
    allowNull: false
  },
    tingkat_kesulitan: {
    type: DataTypes.ENUM(
    "mudah",
    "sedang",
    "sulit"
    ),
    allowNull: true
  },
    status: {
    type: DataTypes.ENUM(
    "aktif",
    "nonaktif"
    ),
    defaultValue: "aktif"
  }
}, {
  tableName: "bank_soal",
  timestamps: false
});

module.exports = BankSoal;
