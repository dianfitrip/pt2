const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProfileAsesi = sequelize.define("profile_asesi", {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  nik: {
    type: DataTypes.CHAR(16),
    unique: true,
    allowNull: true  
  },
  nama_lengkap: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  jenis_kelamin: {
    type: DataTypes.ENUM("laki-laki", "perempuan"),
    allowNull: true
  },
  tempat_lahir: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tanggal_lahir: {
    type: DataTypes.DATE,
    allowNull: true
  },
  kebangsaan: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rt: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  rw: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  provinsi: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  kota: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  kecamatan: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  kelurahan: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  kode_pos: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  pendidikan_terakhir: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  universitas: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  jurusan: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tahun_lulus: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  pekerjaan: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  jabatan: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  nama_perusahaan: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  alamat_perusahaan: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  telp_perusahaan: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  fax_perusahaan: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email_perusahaan: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  foto_profil: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  portofolio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  pas_foto: {
    type: DataTypes.STRING(255),  
    allowNull: true
  },
  ktp: {
    type: DataTypes.STRING(255),  
    allowNull: true
  },
  ijazah: {
    type: DataTypes.STRING(255),  
    allowNull: true
  },
  transkrip: {
    type: DataTypes.STRING(255),  
    allowNull: true
  },
  kk: {
    type: DataTypes.STRING(255),  
    allowNull: true
  },
  surat_kerja: {
    type: DataTypes.STRING(255),  
    allowNull: true
  },
  ttd_path: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: "profile_asesi",
  timestamps: false
});

module.exports = ProfileAsesi;