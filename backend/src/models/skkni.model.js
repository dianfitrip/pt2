const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Skkni = sequelize.define("skkni", {
  id_skkni: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  jenis_standar: {
    type: DataTypes.ENUM("SKKNI", "SKK", "SI"),
    allowNull: false
  },
  no_skkni: DataTypes.STRING(100),
  judul_skkni: {
  type: DataTypes.STRING(255),
  allowNull: false
  },
  legalitas: DataTypes.TEXT,
  sektor: DataTypes.STRING(150),
  sub_sektor: DataTypes.STRING(150),
  penerbit: DataTypes.STRING(150),
  dokumen: DataTypes.STRING(255)
}, {
  tableName: "skkni",
  timestamps: false
});

module.exports = Skkni;
