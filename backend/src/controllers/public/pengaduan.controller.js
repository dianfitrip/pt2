const axios = require("axios");
const Pengaduan = require("../../models/pengaduan.model");

exports.create = async (req, res) => {
  try {
    const { captchaToken, ...payload } = req.body;

    if (!captchaToken) {
      return res.status(400).json({
        message: "Captcha wajib diisi",
      });
    }

    const verify = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );

    if (!verify.data.success) {
      return res.status(400).json({
        message: "Captcha tidak valid",
      });
    }

    const data = await Pengaduan.create(payload);

    res.json({
      message: "Pengaduan terkirim",
      data,
    });
  } catch (err) {
    console.error("PENGADUAN ERROR:", err);
    res.status(500).json({ message: "Gagal kirim pengaduan" });
  }
};
