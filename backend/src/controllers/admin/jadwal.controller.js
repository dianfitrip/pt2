const { Jadwal, Skema, Tuk, User, JadwalAsesor,  PesertaJadwal } = require("../../models");
const response = require("../../utils/response.util");
const sequelize = require("../../config/database");

exports.create = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      kode_jadwal,
      id_skema,
      id_tuk,
      nama_kegiatan,
      tahun,
      periode_bulan,
      gelombang,
      tgl_pra_asesmen,
      tgl_awal,
      tgl_akhir,
      jam,
      kuota,
      pelaksanaan_uji,
      url_agenda
    } = req.body;

    if (!id_skema || !id_tuk || !nama_kegiatan) {
      await t.rollback();
      return response.error(res, "Data wajib belum lengkap", 400);
    }

    const jadwal = await Jadwal.create({
      kode_jadwal,
      id_skema,
      id_tuk,
      nama_kegiatan,
      tahun,
      periode_bulan,
      gelombang,
      tgl_pra_asesmen,
      tgl_awal,
      tgl_akhir,
      jam,
      kuota,
      pelaksanaan_uji,
      url_agenda,
      created_by: req.user.id_user
    }, { transaction: t });

    await t.commit();
    return response.success(res, "Jadwal berhasil dibuat", jadwal);

  } catch (err) {
    await t.rollback();
    return response.error(res, err.message);
  }
};

exports.getAll = async (req, res) => {
  try {

    const data = await Jadwal.findAll({
      include: [
        { model: Skema, as: "skema" },
        { model: Tuk, as: "tuk" },
        { model: User, as: "creator", attributes: ["id_user","username"] },
        { model: JadwalAsesor },
        { model: PesertaJadwal }
      ],
      order: [["created_at", "DESC"]]
    });

    return response.success(res, "List Jadwal", data);

  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.getById = async (req, res) => {
  try {

    const data = await Jadwal.findByPk(req.params.id, {
      include: [
        { model: Skema, as: "skema" },
        { model: Tuk, as: "tuk" },
        { model: User, as: "creator" },
        {
          model: JadwalAsesor,
          include: [
            { model: User, as: "asesor", attributes: ["id_user","username","email"] }
          ]
        },
        {
          model: PesertaJadwal,
          include: [
            { model: User, as: "user", attributes: ["id_user","username","email"] }
          ]
        }
      ]
    });

    if (!data)
      return response.error(res, "Jadwal tidak ditemukan", 404);

    return response.success(res, "Detail Jadwal", data);

  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {

    const jadwal = await Jadwal.findByPk(req.params.id);
    if (!jadwal)
      return response.error(res, "Jadwal tidak ditemukan", 404);

    await jadwal.update(req.body);

    return response.success(res, "Jadwal berhasil diperbarui", jadwal);

  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const jadwal = await Jadwal.findByPk(req.params.id);
    if (!jadwal)
      return response.error(res, "Jadwal tidak ditemukan", 404);

    await jadwal.update({ status });

    return response.success(res, "Status jadwal diperbarui", jadwal);

  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  const t = await sequelize.transaction();

  try {

    const jadwal = await Jadwal.findByPk(req.params.id, { transaction: t });

    if (!jadwal) {
      await t.rollback();
      return response.error(res, "Jadwal tidak ditemukan", 404);
    }

    await jadwal.destroy({ transaction: t });

    await t.commit();
    return response.success(res, "Jadwal berhasil dihapus");

  } catch (err) {
    await t.rollback();
    return response.error(res, err.message);
  }
};