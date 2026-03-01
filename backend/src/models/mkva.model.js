const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mkva = sequelize.define('Mkva', {
  id_mkva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_jadwal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jenis_tugas: {
    type: DataTypes.ENUM('asesor_penguji', 'verifikator_tuk', 'validator_mkva', 'komite_teknis'),
    allowNull: false,
    defaultValue: 'validator_mkva',
  },
  periode: {
    type: DataTypes.ENUM('sebelum_asesmen', 'pada_saat_asesmen', 'setelah_asesmen'),
    allowNull: false,
  },
  tujuan_fokus_validasi: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  konteks_validasi: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  pendekatan_validasi: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  asesor_kompetensi: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  lead_asesor: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  manajer_supervisor: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  tenaga_ahli: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  koord_pelatihan: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  anggota_asosiasi: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  hasil_konfirmasi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  acuan_pembanding: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  dokumen_terkait: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  keterampilan_komunikasi: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  proses_asesmen: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  rencana_asesmen: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  interpretasi_standar_kompetensi: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  interpretasi_acuan_pembanding_lainnya: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  penyeleksian_metode_asesmen: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  penyeleksian_perangkat_asesmen: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  bukti_bukti_dikumpulkan: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  proses_pengambilan_keputusan: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  kontribusi_hasil_asesmen: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  temuan_rekomendasi: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  rencana_implementasi: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'mkva',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Mkva.associate = (models) => {
  Mkva.belongsTo(models.JadwalAsesor, {
    foreignKey: 'id_jadwal',
    targetKey: 'id_jadwal',
    as: 'jadwalAsesor',
  });

  Mkva.belongsTo(models.Jadwal, {
    foreignKey: 'id_jadwal',
    as: 'jadwal',
  });

  Mkva.belongsTo(models.User, {
    foreignKey: 'id_user',
    as: 'user',
  });
};

module.exports = Mkva;