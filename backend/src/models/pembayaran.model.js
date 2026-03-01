const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pembayaran = sequelize.define("pembayaran", {
  id_pembayaran: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_apl01: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  metode_pembayaran: {
    type: DataTypes.ENUM("tunai", "transfer_rekening"),
    allowNull: false
  },
  jalur_pembayaran: {
    type: DataTypes.ENUM("tunai", "m-banking", "atm", "e-wallet"),
    allowNull: true
  },
  id_tujuan_transfer: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  nominal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  waktu_pembayaran: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  waktu_batas: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("pending", "paid", "expired", "cancelled"),
    defaultValue: "pending"
  },
  bukti_bayar: {
    type: DataTypes.STRING(255),  
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "pembayaran",
  timestamps: false
});

module.exports = Pembayaran;