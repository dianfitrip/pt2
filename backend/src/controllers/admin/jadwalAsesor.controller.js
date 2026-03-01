const { JadwalAsesor, User } = require("../../models");
const response = require("../../utils/response.util");
const sequelize = require("../../config/database");

exports.assign = async (req, res) => {

  const t = await sequelize.transaction();

  try {

    const { id_jadwal, id_user, jenis_tugas, catatan } = req.body;

    if (!id_jadwal || !id_user || !jenis_tugas) {
      await t.rollback();
      return response.error(res, "Data belum lengkap", 400);
    }

    const data = await JadwalAsesor.create({
      id_jadwal,
      id_user,
      jenis_tugas,
      catatan,
      assigned_by: req.user.id_user
    }, { transaction: t });

    await t.commit();

    return response.success(res, "Asesor berhasil ditugaskan", data);

  } catch (err) {
    await t.rollback();
    return response.error(res, err.message);
  }
};

exports.getByJadwal = async (req, res) => {
  try {

    const data = await JadwalAsesor.findAll({
      where: { id_jadwal: req.params.id_jadwal },
      include: [
        { model: User, as: "asesor", attributes: ["id_user","username","email"] }
      ]
    });

    return response.success(res, "List Asesor Jadwal", data);

  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const data = await JadwalAsesor.findOne({
      where: {
        id_jadwal: req.params.id_jadwal,
        id_user: req.params.id_user,
        jenis_tugas: req.params.jenis_tugas
      }
    });

    if (!data)
      return response.error(res, "Data tidak ditemukan", 404);

    await data.update({ status });

    return response.success(res, "Status tugas diperbarui", data);

  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.remove = async (req, res) => {
  try {

    const deleted = await JadwalAsesor.destroy({
      where: {
        id_jadwal: req.params.id_jadwal,
        id_user: req.params.id_user,
        jenis_tugas: req.params.jenis_tugas
      }
    });

    if (!deleted)
      return response.error(res, "Data tidak ditemukan", 404);

    return response.success(res, "Asesor berhasil dihapus dari jadwal");

  } catch (err) {
    return response.error(res, err.message);
  }
};