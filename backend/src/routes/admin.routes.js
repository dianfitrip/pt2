const router = require("express").Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const uploadExcel = require("../middlewares/uploadExcel.middleware");
const adminController = require("../controllers/admin/admin.controller");
const pendaftaranController = require("../controllers/admin/pendaftaran.controller");
const asesiAdmin = require("../controllers/admin/asesi.controller");
const pengaduanController = require("../controllers/admin/pengaduan.controller");
const notifikasiController = require("../controllers/admin/notifikasi.controller");
const asesorAdmin = require("../controllers/admin/asesor.controller");
const tukAdmin = require("../controllers/admin/tuk.controller");
const skkniController = require("../controllers/admin/skkni.controller");
const skemaController = require("../controllers/admin/skema.controller");
const biayaUjiController = require("../controllers/admin/biayaUji.controller");
const persyaratanController = require("../controllers/admin/persyaratan.controller");
const persyaratanTukController = require("../controllers/admin/persyaratanTuk.controller");
const kelompokPekerjaanController = require("../controllers/admin/kelompokPekerjaan.controller");
const tukTempatController = require("../controllers/admin/tukTempat.controller");
const adminProfile = require("../controllers/admin/profile.controller");
const bandingController = require("../controllers/admin/banding.controller");
const dokumenMutuController = require("../controllers/admin/dokumenMutu.controller");
const jadwalController = require("../controllers/admin/jadwal.controller");
const jadwalAsesorController = require("../controllers/admin/jadwalAsesor.controller");
const pesertaJadwalController = require("../controllers/admin/pesertaJadwal.controller");
const unitKompetensiController = require("../controllers/admin/unitKompetensi.controller");
const upload = require("../middlewares/upload.middleware");
const ctrl = require("../controllers/admin/surveillance.controller");
const mapaController = require("../controllers/admin/mapa.controller");
const mapa01Controller = require("../controllers/admin/mapa01.controller");
const mapa02Controller = require("../controllers/admin/mapa02.controller");
const bankSoalController = require("../controllers/admin/bankSoal.controller");
const bankSoalPGController = require("../controllers/admin/bankSoalPG.controller");
const ia01Controller = require("../controllers/admin/ia01Observasi.controller");
const ia03Controller = require("../controllers/admin/ia03Pertanyaan.controller");
const accountController = require("../controllers/admin/account.controller");

router.use(authMiddleware, roleMiddleware.adminOnly);

router.get("/surveillance", ctrl.getAllSurveillance);
router.put("/surveillance/:id/status", ctrl.updateStatusSurveillance);
router.get("/surveillance/export", ctrl.exportSurveillance);

router.get("/profile", adminProfile.getProfile);
router.put("/profile", adminProfile.updateProfile);

router.post( "/dokumen-mutu", upload, dokumenMutuController.createDokumen);
router.put( "/dokumen-mutu/:id", upload, dokumenMutuController.updateDokumen);
router.get("/dokumen-mutu", dokumenMutuController.getAllDokumen);
router.delete("/dokumen-mutu/:id", dokumenMutuController.deleteDokumen);

router.post("/asesor", asesorAdmin.createAsesor);
router.get("/asesor", asesorAdmin.getAll);
router.get("/asesor/:id", asesorAdmin.getById);
router.put("/asesor/:id", asesorAdmin.update);
router.delete("/asesor/:id", asesorAdmin.delete);
router.post("/import-asesor", uploadExcel.single("file"), asesorAdmin.importAsesorExcel);
router.post("/asesor/:id/reset-password", asesorAdmin.resetPassword);

router.post("/import-asesi", uploadExcel.single("file"), asesiAdmin.importAsesiExcel);
router.get("/asesi", asesiAdmin.getAll);
router.get("/asesi/:id", asesiAdmin.getById);
router.put("/asesi/:id", asesiAdmin.update);
router.delete("/asesi/:id", asesiAdmin.delete);

router.post("/tuk-akun", tukAdmin.createTuk);
router.post("/import-tuk", uploadExcel.single("file"), tukAdmin.importTukExcel);
router.get("/tuk", tukAdmin.getAll);
router.get("/tuk/:id", tukAdmin.getById);
router.put("/tuk/:id", tukAdmin.update);
router.delete("/tuk/:id", tukAdmin.delete);

router.post("/send-email/:id", accountController.sendAccountEmailManual);

router.get("/dashboard", adminController.getDashboard);

router.get("/pendaftaran", pendaftaranController.getAll);
router.post("/pendaftaran/:id/approve", pendaftaranController.approvePendaftaran);
router.post("/pendaftaran/:id/reject", pendaftaranController.rejectPendaftaran);


router.get("/pengaduan", pengaduanController.getAllPengaduan);
router.put("/pengaduan/:id/status", pengaduanController.updateStatusPengaduan);

router.get("/notifikasi", notifikasiController.getAll);

router.post("/jadwal", jadwalController.create);
router.get("/jadwal", jadwalController.getAll);
router.get("/jadwal/:id", jadwalController.getById);
router.put("/jadwal/:id", jadwalController.update);
router.put("/jadwal/:id/status", jadwalController.updateStatus);
router.delete("/jadwal/:id", jadwalController.delete);

router.post("/jadwal-asesor", jadwalAsesorController.assign);
router.get("/jadwal-asesor/:id_jadwal", jadwalAsesorController.getByJadwal);
router.put("/jadwal-asesor/:id_jadwal/:id_user/:jenis_tugas", jadwalAsesorController.updateStatus);
router.delete("/jadwal-asesor/:id_jadwal/:id_user/:jenis_tugas", jadwalAsesorController.remove);

router.post("/skkni", upload, skkniController.create);
router.put("/skkni/:id", upload, skkniController.update);
router.get("/skkni", skkniController.getAll);
router.get("/skkni/:id", skkniController.getById);
router.delete("/skkni/:id", skkniController.delete);

router.post("/skema", skemaController.create);
router.get("/skema", skemaController.getAll);
router.get("/skema/:id", skemaController.getDetail);
router.put("/skema/:id", skemaController.update);
router.delete("/skema/:id", skemaController.delete);

router.post("/biaya-uji", biayaUjiController.create);
router.get("/biaya-uji/skema/:id_skema", biayaUjiController.getBySkema);
router.put("/biaya-uji/:id", biayaUjiController.update);
router.delete("/biaya-uji/:id", biayaUjiController.delete);

router.post("/persyaratan", persyaratanController.create);
router.get("/persyaratan", persyaratanController.getAll);

router.post("/persyaratan-tuk", persyaratanTukController.create);
router.get("/persyaratan-tuk", persyaratanTukController.getAll);
router.post("/persyaratan-tuk/attach", persyaratanTukController.attachToSkema);
router.delete( "/persyaratan-tuk/detach/:id_skema/:id_persyaratan_tuk", persyaratanTukController.detachFromSkema);

router.post("/kelompok-pekerjaan", kelompokPekerjaanController.create);
router.get( "/kelompok-pekerjaan/skema/:id_skema", kelompokPekerjaanController.getBySkema);
router.put("/kelompok-pekerjaan/:id", kelompokPekerjaanController.update);
router.delete("/kelompok-pekerjaan/:id", kelompokPekerjaanController.delete);

router.post("/tuk-tempat", tukTempatController.create);
router.get("/tuk-tempat", tukTempatController.getAll);
router.put("/tuk-tempat/:id", tukTempatController.update);
router.delete("/tuk-tempat/:id", tukTempatController.delete);

router.post("/tuk-tempat/attach-skema", tukTempatController.attachSkema);
router.delete( "/tuk-tempat/detach-skema/:id_tuk/:id_skema", tukTempatController.detachSkema);

router.get("/banding", bandingController.getAllBanding);
router.put("/banding/:id", bandingController.updateStatusBanding);

router.get( "/jadwal/:id_jadwal/peserta", pesertaJadwalController.getPesertaByJadwal);

router.post("/unit-kompetensi", unitKompetensiController.create);
router.get("/unit-kompetensi", unitKompetensiController.getAll);
router.get("/unit-kompetensi/:id", unitKompetensiController.getById);
router.put("/unit-kompetensi/:id", unitKompetensiController.update);
router.delete("/unit-kompetensi/:id", unitKompetensiController.delete);

router.post("/mapa", mapaController.create);
router.get("/mapa", mapaController.getAll);
router.get("/mapa/:id", mapaController.getById);
router.put("/mapa/:id", mapaController.update);
router.delete("/mapa/:id", mapaController.delete);

router.post("/mapa01", mapa01Controller.createOrUpdate);
router.get("/mapa01/:id_mapa", mapa01Controller.getByMapa);

router.post("/mapa02/mapping", mapa02Controller.addMapping);
router.get("/mapa02/mapping/:id_mapa", mapa02Controller.getMappingByMapa);
router.delete("/mapa02/mapping/:id", mapa02Controller.deleteMapping);

router.post("/mapa02/metode", mapa02Controller.addMetode);
router.get("/mapa02/metode/:id_mapping", mapa02Controller.getMetodeByMapping);
router.delete("/mapa02/metode/:id", mapa02Controller.deleteMetode);

router.post("/bank-soal", bankSoalController.create);
router.get("/bank-soal", bankSoalController.getAll);
router.put("/bank-soal/:id", bankSoalController.update);
router.delete("/bank-soal/:id", bankSoalController.delete);

router.post("/bank-soal-pg", bankSoalPGController.create);
router.get("/bank-soal-pg/:id_soal", bankSoalPGController.getBySoal);
router.delete("/bank-soal-pg/:id", bankSoalPGController.delete);

router.post("/ia01-observasi", ia01Controller.create);
router.get("/ia01-observasi/unit/:id_unit", ia01Controller.getByUnit);
router.delete("/ia01-observasi/:id", ia01Controller.delete);

router.post("/ia03-pertanyaan", ia03Controller.create);
router.get("/ia03-pertanyaan/unit/:id_unit", ia03Controller.getByUnit);
router.delete("/ia03-pertanyaan/:id", ia03Controller.delete);

module.exports = router;
