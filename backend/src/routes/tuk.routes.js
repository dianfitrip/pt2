const router = require("express").Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const profileController = require("../controllers/tuk/profile.controller");
const jadwalController = require("../controllers/tuk/jadwal.controller");

router.use(authMiddleware, roleMiddleware.tukOnly);

router.get("/profile", profileController.getProfile);
router.put("/profile", profileController.updateProfile);

router.post("/jadwal", jadwalController.createJadwal);
router.get("/jadwal", jadwalController.getAllJadwal);
router.get("/jadwal/:id", jadwalController.getJadwalById);
router.put("/jadwal/:id", jadwalController.updateJadwal);
router.delete("/jadwal/:id", jadwalController.deleteJadwal);

module.exports = router;