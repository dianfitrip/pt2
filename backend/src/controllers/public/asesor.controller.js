const { ProfileAsesor } = require("../../models");

exports.getAllPublic = async (req, res) => {
  try {
    const data = await ProfileAsesor.findAll({
      where: { status_asesor: "aktif" },
      attributes: [
        "id_user",
        "nama_lengkap",
        "gelar_depan",
        "gelar_belakang",
        "bidang_keahlian"
      ]
    });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};