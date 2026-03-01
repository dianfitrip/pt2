const axios = require("axios");
const { Surveillance, User, ProfileAsesi } = require("../../models");

exports.createSurveillance = async (req, res) => {
  try {
    const {
      captchaToken,
      nik,
      id_skema,
      periode_surveillance,
      nomor_sertifikat,
      nomor_registrasi,
      sumber_dana,
      nama_perusahaan,
      alamat_perusahaan,
      jabatan_pekerjaan,
      nama_proyek,
      jabatan_dalam_proyek,
      kesesuaian_kompetensi,
      keterangan_lainnya,
    } = req.body;

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

    const profile = await ProfileAsesi.findOne({
      where: { nik },
    });

    if (!profile) {
      return res.status(404).json({
        message: "Data asesi tidak ditemukan",
      });
    }

    const id_user = profile.id_user;

    const existing = await Surveillance.findOne({
      where: {
        id_user,
        id_skema,
        periode_surveillance,
      },
    });

    if (existing) {
      return res.status(400).json({
        message:
          "Surveillance untuk skema dan periode ini sudah pernah diisi",
      });
    }

    const data = await Surveillance.create({
      id_user,
      id_skema,
      periode_surveillance,
      nomor_sertifikat,
      nomor_registrasi,
      sumber_dana,
      nama_perusahaan,
      alamat_perusahaan,
      jabatan_pekerjaan,
      nama_proyek,
      jabatan_dalam_proyek,
      kesesuaian_kompetensi,
      keterangan_lainnya,
    });

    return res.status(201).json({
      message: "Surveillance berhasil dikirim",
      data,
    });
  } catch (err) {
    console.error("CREATE SURVEILLANCE ERROR:", err);
    return res.status(500).json({
      message: "Gagal mengirim surveillance",
    });
  }
};
