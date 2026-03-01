const axios = require("axios");
const Pendaftaran = require("../../models/pendaftaranAsesi.model");
const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const { captchaToken, ...payload } = req.body;

    if (!captchaToken) {
      return response.error(res, "Captcha wajib diisi", 400);
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
      return response.error(res, "Captcha tidak valid", 400);
    }

    const data = await Pendaftaran.create(payload);

    response.success(res, "Pendaftaran berhasil", data);
  } catch (err) {
    console.error("PENDAFTARAN ERROR:", err);
    response.error(res, "Gagal mendaftar");
  }
};
