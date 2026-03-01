const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FrAk07 = sequelize.define('FrAk07', {
  id_fr_ak_07: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_fr_ak_07' 
  },
  id_peserta_jadwal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'peserta_jadwal',
      key: 'id_peserta'
    }
  },
  id_asesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id_user'
    }
  },
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  
  panduan_jenis: {
    type: DataTypes.ENUM(
      'Hasil pelatihan dan / atau pendidikan, dimana Kurikulum dan fasilitas praktek mampu telusur terhadap standar kompetensi',
      'Hasil pelatihan dan / atau pendidikan, dimana kurikulum belum berbasis kompetensi',
      'Pekerja berpengalaman, dimana berasal dari industri/tempat kerja yang dalam operasionalnya mampu telusur dengan standar kompetensi',
      'Pekerja berpengalaman, dimana berasal dari industri/tempat kerja yang dalam operasionalnya belum berbasis kompetensi',
      'Pelatihan / Belajar Mandiri atau Otodidak'
    ),
    allowNull: false
  },

  a1_penyesuaian: DataTypes.ENUM('Ya', 'Tidak'),
  a1_keterangan: DataTypes.TEXT, 

  a2_penyesuaian: DataTypes.ENUM('Ya', 'Tidak'),
  a2_keterangan: DataTypes.TEXT,
  
  a3_penyesuaian: DataTypes.ENUM('Ya', 'Tidak'),
  a3_keterangan: DataTypes.TEXT,
  
  a4_penyesuaian: DataTypes.ENUM('Ya', 'Tidak'),
  a4_keterangan: DataTypes.TEXT,
  
  a5_penyesuaian: DataTypes.ENUM('Ya', 'Tidak'),
  a5_keterangan: DataTypes.TEXT,
  
  a6_penyesuaian: DataTypes.ENUM('Ya', 'Tidak'),
  a6_keterangan: DataTypes.TEXT,
  
  a7_penyesuaian: DataTypes.ENUM('Ya', 'Tidak'),
  a7_keterangan: DataTypes.TEXT,
  
  a8_penyesuaian: DataTypes.ENUM('Ya', 'Tidak'),
  a8_keterangan: DataTypes.TEXT,

  b1_sesuai: DataTypes.ENUM('Ya', 'Tidak'),
  b1_keputusan: DataTypes.TEXT, 

  b2_sesuai: DataTypes.ENUM('Ya', 'Tidak'),
  b2_keputusan: DataTypes.TEXT,

  b3_sesuai: DataTypes.ENUM('Ya', 'Tidak'),
  b3_keputusan: DataTypes.TEXT, 

  hasil_penyesuaian_karakteristik: DataTypes.TEXT,
  hasil_penyesuaian_rencana: DataTypes.TEXT,

  ttd_asesor_path: DataTypes.STRING(255),

}, {
  tableName: 'fr_ak_07',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = FrAk07;