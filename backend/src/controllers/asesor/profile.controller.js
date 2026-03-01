const ProfileAsesor = require("../../models/profileAsesor.model");
const response = require("../../utils/response.util");
const fs = require("fs");
const path = require("path");

exports.getProfile = async (req, res) => {
  try {
    const data = await ProfileAsesor.findByPk(req.user.id_user);
    response.success(res, "Profil asesor", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    await ProfileAsesor.update(req.body, {
      where: { id_user: req.user.id_user }
    });
    response.success(res, "Profil asesor diperbarui");
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.uploadTTD = async (req, res) => {
  try {
    const file = req.files && req.files['ttd'] ? req.files['ttd'][0] : null;

    if (!file) {
      return response.error(res, "File TTD tidak ditemukan", 400);
    }

    const profileLama = await ProfileAsesor.findByPk(req.user.id_user);
    
    if (profileLama && profileLama.ttd_path) {
      const filePathLama = path.join(__dirname, "../../../", profileLama.ttd_path);
      if (fs.existsSync(filePathLama)) {
        fs.unlinkSync(filePathLama);
      }
    }

    const ttdPath = file.path;

    const [affectedRows] = await ProfileAsesor.update(
      { ttd_path: ttdPath },
      { where: { id_user: req.user.id_user } }
    );

    if (affectedRows === 0) {
      return response.error(res, "Upload TTD gagal", 404);
    }

    response.success(res, "TTD berhasil disimpan", { ttd_path: ttdPath });
  } catch (err) {
    console.error(err);
    response.error(res, err.message);
  }
};