const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mapa02Peserta = sequelize.define('Mapa02Peserta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_peserta: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_mapa: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_mapping: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  metode: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  nilai: {
    type: DataTypes.TINYINT,
    validate: { min: 1, max: 4 }
  }
}, {
  tableName: 'mapa02_peserta',
  timestamps: false
});

module.exports = Mapa02Peserta;