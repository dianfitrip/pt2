const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PesertaJadwal = sequelize.define("peserta_jadwal", {
  id_peserta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_jadwal: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status_asesmen: {
    type: DataTypes.ENUM(
      "terdaftar",
      "pra_asesmen",
      "asesmen",
      "kompeten",
      "belum_kompeten"
    ),
    defaultValue: "terdaftar"
  },
  nilai_akhir: DataTypes.DECIMAL(5, 2),
  keterangan: DataTypes.TEXT,
  nomor_peserta: DataTypes.STRING(50),
  waktu_mulai: DataTypes.DATE,
  waktu_selesai: DataTypes.DATE,
  created_at: DataTypes.DATE
}, {
  tableName: "peserta_jadwal",
  timestamps: false
});

module.exports = PesertaJadwal;
