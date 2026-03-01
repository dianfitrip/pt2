const User = require("./user.model");
const Role = require("./role.model");
const ProfileAsesi = require("./profileAsesi.model");
const ProfileAsesor = require("./profileAsesor.model");
const ProfileAdmin = require("./profileAdmin.model");
const ProfileTuk = require("./profileTuk.model");
const Pengaduan = require("./pengaduan.model");
const PendaftaranAsesi = require("./pendaftaranAsesi.model");
const Notifikasi = require("./notifikasi.model");
const Skkni = require("./skkni.model");
const Skema = require("./skema.model");
const BiayaUji = require("./biayaUji.model");
const Persyaratan = require("./persyaratan.model");
const SkemaPersyaratan = require("./skemaPersyaratan.model");
const PersyaratanTuk = require("./persyaratanTuk.model");
const SkemaPersyaratanTuk = require("./skemaPersyaratanTuk.model");
const KelompokPekerjaan = require("./kelompokPekerjaan.model");
const Tuk = require("./tuk.model");
const TukSkema = require("./tukSkema.model");
const BandingAsesmen = require("./bandingAsesmen.model");
const DokumenMutu = require("./dokumenMutu.model");
const Jadwal = require("./jadwal.model");
const JadwalAsesor = require("./jadwalAsesor.model");
const PesertaJadwal = require("./pesertaJadwal.model");
const Apl01Asesmen = require("./apl01Asesmen.model");
const Apl02AsesmenMandiri = require("./apl02AsesmenMandiri.model");
const TujuanPembayaran = require("./tujuanPembayaran.model");
const Pembayaran = require("./pembayaran.model");
const UnitKompetensi = require("./unitKompetensi.model");
const SkemaSkkni = require("./skemaSkkni.model");
const Surveillance = require("./surveillance.model");
const Apl01Unit = require("./apl01Unit.model");
const Apl01Persyaratan = require("./apl01Persyaratan.model");
const BankSoal = require("./bankSoal.model");
const BankSoalPG = require("./bankSoalPG.model")
const UnitElemen = require("./unitElemen.model")
const UnitKuk = require("./unitKuk.model")
const IA01Observasi = require("./ia01Observasi.model")
const IA03Pertanyaan = require("./ia03Pertanyaan.model")
const Mapa = require("./mapa.model");
const Mapa01 = require("./mapa01.model");
const Mapa02Mapping = require("./mapa02Mapping.model");
const Mapa02Metode = require("./mapa02Metode.model");
const Mkva = require("./mkva.model");
const FrAk01 = require("./frAk01.model");
const FrAk02 = require("./frAk02.model");
const FrAk05 = require("./frAk05.model");
const FrAk06 = require("./frAk06.model");
const FrAk07 = require("./frAk07.model");
const Mapa02Peserta = require("./mapa02_peserta.model");

Role.hasMany(User, { foreignKey: "id_role" });
User.belongsTo(Role, { foreignKey: "id_role" });

User.hasOne(ProfileAsesi, { foreignKey: "id_user" });
User.hasOne(ProfileAsesor, { foreignKey: "id_user" });
User.hasOne(ProfileAdmin, { foreignKey: "id_user" });
User.hasOne(ProfileTuk, { foreignKey: "id_user" });

ProfileAsesi.belongsTo(User, { foreignKey: "id_user" });
ProfileAsesor.belongsTo(User, { foreignKey: "id_user" });
ProfileAdmin.belongsTo(User, { foreignKey: "id_user" });
ProfileTuk.belongsTo(User, { foreignKey: "id_user" });

User.hasMany(Notifikasi, { foreignKey: "ref_id", constraints: false });
Notifikasi.belongsTo(User, { foreignKey: "ref_id", constraints: false });

Skkni.hasMany(UnitKompetensi, { foreignKey: "id_skkni" });
UnitKompetensi.belongsTo(Skkni, { foreignKey: "id_skkni" });

Skema.hasMany(BiayaUji, { foreignKey: "id_skema" });
BiayaUji.belongsTo(Skema, { foreignKey: "id_skema" });

Skema.belongsToMany(Persyaratan, { through: SkemaPersyaratan, foreignKey: "id_skema"});

Persyaratan.belongsToMany(Skema, { through: SkemaPersyaratan, foreignKey: "id_persyaratan"});

Skema.belongsToMany(PersyaratanTuk, { through: SkemaPersyaratanTuk, foreignKey: "id_skema"});

PersyaratanTuk.belongsToMany(Skema, { through: SkemaPersyaratanTuk, foreignKey: "id_persyaratan_tuk"});

Skema.hasMany(KelompokPekerjaan, { foreignKey: "id_skema" });
KelompokPekerjaan.belongsTo(Skema, { foreignKey: "id_skema" });

Skema.belongsToMany(Tuk, { through: TukSkema, foreignKey: "id_skema"});

Tuk.belongsToMany(Skema, { through: TukSkema, foreignKey: "id_tuk"});

Skema.hasMany(Jadwal, { foreignKey: "id_skema" });
Jadwal.belongsTo(Skema, { foreignKey: "id_skema", as: "skema" });

Tuk.hasMany(Jadwal, { foreignKey: "id_tuk" });
Jadwal.belongsTo(Tuk, { foreignKey: "id_tuk", as: "tuk" });

User.hasMany(Jadwal, { foreignKey: "created_by" });
Jadwal.belongsTo(User, { foreignKey: "created_by", as: "creator" });

Jadwal.hasMany(JadwalAsesor, { foreignKey: "id_jadwal" });
JadwalAsesor.belongsTo(Jadwal, { foreignKey: "id_jadwal" });

User.hasMany(JadwalAsesor, { foreignKey: "id_user" });
JadwalAsesor.belongsTo(User, { foreignKey: "id_user", as: "asesor" });

User.hasMany(JadwalAsesor, { foreignKey: "assigned_by" });
JadwalAsesor.belongsTo(User, { foreignKey: "assigned_by", as: "assigner"});

User.hasMany(PesertaJadwal, { foreignKey: "id_user" });
PesertaJadwal.belongsTo(User, {foreignKey: "id_user", as: "user"});
Jadwal.hasMany(PesertaJadwal, { foreignKey: "id_jadwal" });
PesertaJadwal.belongsTo(Jadwal, { foreignKey: "id_jadwal", as: "jadwal"});

Apl01Asesmen.belongsTo(User, { foreignKey: "id_user" });
Apl01Asesmen.belongsTo(Skema, { foreignKey: "id_skema" });
Apl01Asesmen.belongsTo(Jadwal, { foreignKey: "id_jadwal" });

Apl01Asesmen.hasMany(Apl02AsesmenMandiri, { foreignKey: "id_apl01" });
Apl02AsesmenMandiri.belongsTo(Apl01Asesmen, { foreignKey: "id_apl01" });

Apl02AsesmenMandiri.belongsTo(UnitKompetensi, { foreignKey: "id_unit"});

Pembayaran.belongsTo(Apl01Asesmen, { foreignKey: "id_apl01" });
Apl01Asesmen.hasMany(Pembayaran, { foreignKey: "id_apl01" });

Pembayaran.belongsTo(TujuanPembayaran, { foreignKey: "id_tujuan_transfer"});

User.hasMany(BandingAsesmen, { foreignKey: "id_user" });
BandingAsesmen.belongsTo(User, { foreignKey: "id_user", as: "user"});

Jadwal.hasMany(BandingAsesmen, { foreignKey: "id_jadwal" });
BandingAsesmen.belongsTo(Jadwal, { foreignKey: "id_jadwal" });

Skema.hasMany(BandingAsesmen, { foreignKey: "id_skema" });
BandingAsesmen.belongsTo(Skema, { foreignKey: "id_skema" });

Skema.belongsToMany(Skkni, { through: SkemaSkkni, foreignKey: "id_skema"});

Skkni.belongsToMany(Skema, { through: SkemaSkkni, foreignKey: "id_skkni"});

User.hasMany(Surveillance, { foreignKey: "id_user" });
Surveillance.belongsTo(User, { foreignKey: "id_user" });

Skema.hasMany(Surveillance, { foreignKey: "id_skema" });
Surveillance.belongsTo(Skema, { foreignKey: "id_skema" });

Apl01Asesmen.belongsToMany(Persyaratan, {through: Apl01Persyaratan, foreignKey: "id_apl01"});

Persyaratan.belongsToMany(Apl01Asesmen, {through: Apl01Persyaratan, foreignKey: "id_persyaratan"});

Apl01Asesmen.belongsToMany(UnitKompetensi, {through: Apl01Unit,foreignKey: "id_apl01"});

UnitKompetensi.belongsToMany(Apl01Asesmen, {through: Apl01Unit, foreignKey: "id_unit"});
UnitKompetensi.hasMany(IA01Observasi, { foreignKey: "id_unit"});
UnitKuk.hasMany(IA01Observasi, { foreignKey: "id_kuk"});
UnitKompetensi.hasMany(Apl02AsesmenMandiri, { foreignKey: "id_unit"});

BankSoal.hasMany(BankSoalPG, { foreignKey: "id_soal" });
BankSoalPG.belongsTo(BankSoal, { foreignKey: "id_soal" });

UnitKompetensi.hasMany(UnitElemen, { foreignKey: "id_unit" });
UnitElemen.belongsTo(UnitKompetensi, { foreignKey: "id_unit" });

UnitElemen.hasMany(UnitKuk, { foreignKey: "id_elemen" });
UnitKuk.belongsTo(UnitElemen, { foreignKey: "id_elemen" });

IA01Observasi.belongsTo(UnitKompetensi, { foreignKey: "id_unit" });
IA01Observasi.belongsTo(UnitKuk, { foreignKey: "id_kuk" });

IA03Pertanyaan.belongsTo(UnitKompetensi, { foreignKey: "id_unit" });
UnitKompetensi.hasMany(IA03Pertanyaan, { foreignKey: "id_unit" });

BankSoal.belongsTo(UnitKompetensi, { foreignKey: "id_unit" });
UnitKompetensi.hasMany(BankSoal, { foreignKey: "id_unit" });

Skema.hasMany(Mapa, { foreignKey: "id_skema" });
Mapa.belongsTo(Skema, { foreignKey: "id_skema" });

User.hasMany(Mapa, { foreignKey: "created_by" });
Mapa.belongsTo(User, {foreignKey: "created_by", as: "creator"});

Mapa.hasOne(Mapa01, { foreignKey: "id_mapa" });
Mapa01.belongsTo(Mapa, { foreignKey: "id_mapa" });

Mapa.hasMany(Mapa02Mapping, { foreignKey: "id_mapa" });
Mapa02Mapping.belongsTo(Mapa, { foreignKey: "id_mapa" });

UnitKompetensi.hasMany(Mapa02Mapping, { foreignKey: "id_unit" });
Mapa02Mapping.belongsTo(UnitKompetensi, { foreignKey: "id_unit" });

KelompokPekerjaan.hasMany(Mapa02Mapping, { foreignKey: "id_kelompok"});
Mapa02Mapping.belongsTo(KelompokPekerjaan, { foreignKey: "id_kelompok"});

Mapa02Mapping.hasMany(Mapa02Metode, { foreignKey: "id_mapping"});
Mapa02Metode.belongsTo(Mapa02Mapping, { foreignKey: "id_mapping"});

Mkva.belongsTo(Jadwal, { foreignKey: "id_jadwal", as: "jadwal" });
Jadwal.hasMany(Mkva, { foreignKey: "id_jadwal" });

Mkva.belongsTo(User, { foreignKey: "id_user", as: "user" });
User.hasMany(Mkva, { foreignKey: "id_user" });

FrAk01.belongsTo(PesertaJadwal, { foreignKey: "id_peserta_jadwal", as: "pesertaJadwal" });
PesertaJadwal.hasMany(FrAk01, { foreignKey: "id_peserta_jadwal", as: "frAk01" });

FrAk01.belongsTo(User, { foreignKey: "id_asesor", as: "asesor" });
User.hasMany(FrAk01, { foreignKey: "id_asesor" });

FrAk01.belongsTo(ProfileAsesor, { foreignKey: "id_asesor", as: "profileAsesor" });

FrAk02.belongsTo(PesertaJadwal, { foreignKey: "id_peserta", as: "peserta" });
PesertaJadwal.hasMany(FrAk02, { foreignKey: "id_peserta", as: "frAk02" });

FrAk02.belongsTo(Jadwal, { foreignKey: "id_jadwal", as: "jadwal" });
Jadwal.hasMany(FrAk02, { foreignKey: "id_jadwal", as: "frAk02" });

FrAk02.belongsTo(Skema, { foreignKey: "id_skema", as: "skema" });
Skema.hasMany(FrAk02, { foreignKey: "id_skema", as: "frAk02" });

FrAk02.belongsTo(User, { foreignKey: "id_user_asesor", as: "asesor" });
User.hasMany(FrAk02, { foreignKey: "id_user_asesor", as: "frAk02" });

FrAk02.belongsTo(ProfileAsesor, { foreignKey: "id_user_asesor", as: "profileAsesor" });

FrAk05.belongsTo(PesertaJadwal, { foreignKey: "id_peserta", as: "pesertaJadwal" }); 
PesertaJadwal.hasMany(FrAk05, { foreignKey: "id_peserta", as: "frAk05" });

FrAk05.belongsTo(Jadwal, { foreignKey: "id_jadwal", as: "jadwal" }); 
Jadwal.hasMany(FrAk05, { foreignKey: "id_jadwal", as: "frAk05" });

FrAk05.belongsTo(Skema, { foreignKey: "id_skema", as: "skema" }); 
Skema.hasMany(FrAk05, { foreignKey: "id_skema", as: "frAk05" });

FrAk05.belongsTo(Tuk, { foreignKey: "id_tuk", as: "tuk" }); 
Tuk.hasMany(FrAk05, { foreignKey: "id_tuk", as: "frAk05" });

FrAk05.belongsTo(User, { foreignKey: "id_asesor", as: "asesor" }); 
User.hasMany(FrAk05, { foreignKey: "id_asesor", as: "frAk05" });

FrAk05.belongsTo(User, { foreignKey: "id_asesi", as: "asesi" }); 
User.hasMany(FrAk05, { foreignKey: "id_asesi", as: "frAk05Asesi" });

FrAk05.belongsTo(ProfileAsesor, { foreignKey: "id_asesor", as: "profileAsesor" });

FrAk06.belongsTo(Jadwal, { foreignKey: "id_jadwal", as: "jadwal" });
Jadwal.hasMany(FrAk06, { foreignKey: "id_jadwal", as: "frAk06" });

FrAk06.belongsTo(User, { foreignKey: "id_user", as: "user" });
User.hasMany(FrAk06, { foreignKey: "id_user", as: "frAk06" });

FrAk06.belongsTo(Skema, { foreignKey: "id_skema", as: "skema" });
Skema.hasMany(FrAk06, { foreignKey: "id_skema", as: "frAk06" });

FrAk06.belongsTo(Tuk, { foreignKey: "id_tuk", as: "tuk" });
Tuk.hasMany(FrAk06, { foreignKey: "id_tuk", as: "frAk06" });

FrAk06.belongsTo(ProfileAsesor, { foreignKey: "id_user", as: "profileAsesor" });

FrAk07.belongsTo(PesertaJadwal, { foreignKey: "id_peserta_jadwal", as: "pesertaJadwal" }); 
PesertaJadwal.hasMany(FrAk07, { foreignKey: "id_peserta_jadwal", as: "frAk07" });

FrAk07.belongsTo(User, { foreignKey: "id_asesor", as: "asesor" }); 
User.hasMany(FrAk07, { foreignKey: "id_asesor" });

FrAk07.belongsTo(ProfileAsesor, { foreignKey: "id_asesor", as: "profileAsesor" });

PesertaJadwal.hasMany(Mapa02Peserta, { foreignKey: "id_peserta" }); 
Mapa02Peserta.belongsTo(PesertaJadwal, { foreignKey: "id_peserta", as: "pesertaJadwal" });

Mapa.hasMany(Mapa02Peserta, { foreignKey: "id_mapa" }); 
Mapa02Peserta.belongsTo(Mapa, { foreignKey: "id_mapa", as: "mapa" });

Mapa02Mapping.hasMany(Mapa02Peserta, { foreignKey: "id_mapping" });
Mapa02Peserta.belongsTo(Mapa02Mapping, { foreignKey: "id_mapping", as: "mapping" });


module.exports = {
  User,
  Role,
  ProfileAsesi,
  ProfileAsesor,
  ProfileAdmin,
  ProfileTuk,
  Pengaduan,
  PendaftaranAsesi,
  Notifikasi,
  Skkni,
  Skema,
  BiayaUji,
  Persyaratan,
  SkemaPersyaratan,
  PersyaratanTuk,
  SkemaPersyaratanTuk,
  KelompokPekerjaan,
  Tuk,
  TukSkema,
  BandingAsesmen,
  DokumenMutu,
  Jadwal,
  JadwalAsesor,
  PesertaJadwal,
  Apl01Asesmen,
  Apl02AsesmenMandiri,
  TujuanPembayaran,
  Pembayaran,
  UnitKompetensi,
  SkemaSkkni,
  Surveillance,
  Apl01Unit,
  Apl01Persyaratan,
  BankSoal,
  BankSoalPG,
  UnitElemen,
  UnitKuk,
  IA01Observasi,
  IA03Pertanyaan,
  Mapa,
  Mapa01,
  Mapa02Mapping,
  Mapa02Metode,
  Mkva,
  FrAk01,
  FrAk02,
  FrAk05,
  FrAk06,
  FrAk07,
  Mapa02Peserta
};
