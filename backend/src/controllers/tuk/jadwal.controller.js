const { Jadwal, Tuk } = require("../../models");
const { Op } = require("sequelize");

const createJadwal = async (req, res) => {
  try {
    const tukId = req.user.id_tuk;

    if (!tukId) {
      return res.status(400).json({
        message: "ID TUK tidak ditemukan di token."
      });
    }

    const data = await Jadwal.create({
      ...req.body,
      TUK: tukId
    });

    res.status(201).json({
      message: "Jadwal berhasil dibuat",
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

/* =============================== */
const getAllJadwal = async (req, res) => {
  try {
    const tukId = req.user.id_tuk;

    const whereClause = { TUK: tukId };

    const data = await Jadwal.findAll({
      where: whereClause,
      include: [
        {
          model: Tuk,
          as: "tuk",
          attributes: ["nama_tuk", "email"]
        }
      ],
      order: [["Tahun", "DESC"]]
    });

    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

/* =============================== */
const getJadwalById = async (req, res) => {
  try {
    const tukId = req.user.id_tuk;
    const { id } = req.params;

    const data = await Jadwal.findOne({
      where: { id_jadwal: id, TUK: tukId },
      include: [{ model: Tuk, as: "tuk" }]
    });

    if (!data) {
      return res.status(404).json({ message: "Jadwal tidak ditemukan" });
    }

    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

/* =============================== */
const updateJadwal = async (req, res) => {
  try {
    const tukId = req.user.id_tuk;
    const { id } = req.params;

    const jadwal = await Jadwal.findOne({
      where: { id_jadwal: id, TUK: tukId }
    });

    if (!jadwal) {
      return res.status(404).json({ message: "Jadwal tidak ditemukan" });
    }

    await jadwal.update(req.body);

    res.json({
      message: "Jadwal berhasil diupdate",
      data: jadwal
    });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

/* =============================== */
const deleteJadwal = async (req, res) => {
  try {
    const tukId = req.user.id_tuk;
    const { id } = req.params;

    const jadwal = await Jadwal.findOne({
      where: { id_jadwal: id, TUK: tukId }
    });

    if (!jadwal) {
      return res.status(404).json({ message: "Jadwal tidak ditemukan" });
    }

    await jadwal.destroy();

    res.json({ message: "Jadwal berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  createJadwal,
  getAllJadwal,
  getJadwalById,
  updateJadwal,
  deleteJadwal
};
