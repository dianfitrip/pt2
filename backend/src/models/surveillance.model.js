const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Surveillance = sequelize.define(
  "Surveillance",
  {
    id_surveillance: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_skema: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    periode_surveillance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nomor_sertifikat: {
      type: DataTypes.STRING(100),
    },
    nomor_registrasi: {
      type: DataTypes.STRING(100),
    },
    sumber_dana: {
      type: DataTypes.ENUM(
        "apbn",
        "apbd",
        "perusahaan",
        "mandiri"
      ),
      allowNull: false,
    },
    nama_perusahaan: {
      type: DataTypes.STRING(150),
    },
    alamat_perusahaan: {
      type: DataTypes.TEXT,
    },
    jabatan_pekerjaan: {
      type: DataTypes.STRING(150),
    },
    nama_proyek: {
      type: DataTypes.STRING(255),
    },
    jabatan_dalam_proyek: {
      type: DataTypes.STRING(150),
    },
    kesesuaian_kompetensi: {
      type: DataTypes.ENUM(
        "sesuai",
        "tidak_sesuai",
        "lainnya"
      ),
      allowNull: false,
    },
    keterangan_lainnya: {
      type: DataTypes.STRING(255),
    },
    status_verifikasi: {
      type: DataTypes.ENUM(
        "submitted",
        "review",
        "valid",
        "tidak_valid"
      ),
      defaultValue: "submitted",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "surveillance",
    timestamps: false,
  }
);

module.exports = Surveillance;
