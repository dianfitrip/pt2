const router = require("express").Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");
const profileController = require("../controllers/asesor/profile.controller");
const jadwalAsesorController = require("../controllers/asesor/jadwal.controller");
const pesertaJadwalController = require("../controllers/asesor/pesertaJadwal.controller");
const mkvaController = require("../controllers/asesor/mkva.controller");
const frAk01Controller = require("../controllers/asesor/frAk01.controller");
const frAk02Controller = require("../controllers/asesor/frAk02.controller");
const ak05Controller = require("../controllers/asesor/frAk05.controller");
const ak06Controller = require("../controllers/asesor/frAk06.controller"); 
const frAk07Controller = require("../controllers/asesor/frAk07.controller"); 
 const mapa02Controller = require("../controllers/asesor/mapa02.controller");


router.use(authMiddleware, roleMiddleware.asesorOnly);

router.get("/profile", profileController.getProfile);
router.put("/profile", profileController.updateProfile);

router.put("/profile/upload-ttd", (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, profileController.uploadTTD);

router.get("/jadwal-saya", jadwalAsesorController.getJadwalSaya);
router.put("/peserta/:id/nilai", pesertaJadwalController.updateNilaiPeserta);

router.get("/fr-ak-01/form/:id_peserta_jadwal", frAk01Controller.getFormData);
router.post("/fr-ak-01/form/:id_peserta_jadwal", frAk01Controller.submitForm);
router.put("/fr-ak-01/:id_fr_ak_01/sign", frAk01Controller.signForm);
router.get("/fr-ak-01/:id_fr_ak_01/pdf", frAk01Controller.downloadPdf);

router.get("/fr-ak-02/form/:id_user", frAk02Controller.getFormData);
router.post("/fr-ak-02/form/:id_user", frAk02Controller.submitForm);
router.put("/fr-ak-02/:id_fr_ak_02", frAk02Controller.updateForm);
router.get("/fr-ak-02/:id_fr_ak_02/pdf", frAk02Controller.downloadPdf);

router.get("/fr-ak-05/form/:id_jadwal_asesor", ak05Controller.getFormData); 
router.post("/fr-ak-05/submit/:id_jadwal_asesor", ak05Controller.submitForm); 
router.get("/fr-ak-05/my-form/:id_jadwal_asesor/:id_peserta", ak05Controller.getMyForm); 
router.put("/fr-ak-05/my-form/:id_jadwal_asesor/:id_peserta", ak05Controller.getMyForm); 
router.get("/fr-ak-05/download/:id_jadwal_asesor/:id_peserta", ak05Controller.downloadForm);

router.get("/fr-ak-06/form/:id_jadwal", ak06Controller.getFormData); 
router.post("/fr-ak-06/form/:id_jadwal", ak06Controller.submitForm); 
router.put("/fr-ak-06/form/:id_jadwal", ak06Controller.updateForm); 
router.get("/fr-ak-06/download/:id_jadwal", ak06Controller.downloadForm);

router.get("/mkva/jadwal", mkvaController.getJadwalAsesor);
router.get("/mkva/form/:id_jadwal", mkvaController.getFormData);
router.post("/mkva/form/:id_jadwal", mkvaController.submitForm);
router.get("/mkva/download/:id_mkva", mkvaController.downloadForm);
router.get("/mkva/surat-tugas/:id_jadwal", mkvaController.downloadSuratTugas);

router.get("/fr-ak-07/form/:id_user", frAk07Controller.getFormData);
router.post("/fr-ak-07/form/:id_user", frAk07Controller.submitForm);
router.put("/fr-ak-07/form/:id_user", frAk07Controller.submitForm); 
router.get("/fr-ak-07/download/:id_user", frAk07Controller.downloadPdf);

router.get("/fr-mapa-02/form", mapa02Controller.getFormData); 
router.post("/fr-mapa-02/submit", mapa02Controller.submitForm); 
router.put("/fr-mapa-02/update-score", mapa02Controller.updateScore); 
router.get("/fr-mapa-02/download", mapa02Controller.downloadPDF);

module.exports = router;