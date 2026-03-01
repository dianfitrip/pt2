const { BandingAsesmen, User } = require("../../models");
const { Op } = require("sequelize");
const response = require("../../utils/response.util");

const getAllBanding = async (req, res) => {
  try {
    const { status, search } = req.query;

    const whereCondition = {};

    if (status) {
      whereCondition.status_progress = status;
    }

    if (search) {
      whereCondition[Op.or] = [
        { keputusan: { [Op.like]: `%${search}%` } },
        { catatan_komite: { [Op.like]: `%${search}%` } },
      ];
    }

    const data = await BandingAsesmen.findAll({
      where: whereCondition,
      include: [{ model: User, as: "user" }],
      order: [["tanggal_ajukan", "DESC"]],
    });

    return response.success(res, "List banding", data);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const updateStatusBanding = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_progress, keputusan, catatan_komite } = req.body;

    const banding = await BandingAsesmen.findByPk(id);

    if (!banding) {
      return response.error(res, "Banding tidak ditemukan", 404);
    }

    await banding.update({
      status_progress,
      keputusan,
      catatan_komite,
      tanggal_putusan:
        keputusan && keputusan !== "belum_diputuskan"
          ? new Date()
          : null,
    });

    return response.success(res, "Banding berhasil diupdate", banding);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getAllBanding,
  updateStatusBanding,
};