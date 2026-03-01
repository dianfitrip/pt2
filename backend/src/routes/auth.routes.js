const router = require("express").Router();
const authController = require("../controllers/auth/auth.controller");
const { loginLimiter } = require("../middlewares/rateLimit.middleware");

router.post("/login", loginLimiter, authController.login);
router.post("/logout", authController.logout);

module.exports = router;
