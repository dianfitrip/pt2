const { Pengaduan } = require("../../models");
const { Op } = require("sequelize");
const response = require("../../utils/response.util");

const getAllPengaduan = async (req, res) => {
  try {
    const { search, status_pengaduan } = req.query;

    const where = {};

    if (status_pengaduan) {
      where.status_pengaduan = status_pengaduan;
    }

    if (search) {
      where[Op.or] = [
        { nama_pengadu: { [Op.like]: `%${search}%` } },
        { email_pengadu: { [Op.like]: `%${search}%` } },
        { isi_pengaduan: { [Op.like]: `%${search}%` } }
      ];
    }

    const data = await Pengaduan.findAll({
      where,
      order: [["tanggal_pengaduan", "DESC"]]
    });

    return response.success(res, "List pengaduan", data);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const updateStatusPengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_pengaduan } = req.body;

    const pengaduan = await Pengaduan.findByPk(id);
    if (!pengaduan) {
      return response.error(res, "Pengaduan tidak ditemukan", 404);
    }

    await pengaduan.update({ status_pengaduan });

    return response.success(res, "Status berhasil diupdate", pengaduan);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getAllPengaduan,
  updateStatusPengaduan
};