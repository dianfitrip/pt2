const { BandingAsesmen, Jadwal, Skema } = require("../../models");

const ajukanBanding = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const { id_jadwal, id_skema, isi_banding } = req.body;

    if (!isi_banding) {
      return res.status(400).json({ message: "Isi banding wajib diisi" });
    }

    const banding = await BandingAsesmen.create({
      id_user,
      id_jadwal,
      id_skema,
      isi_banding
    });

    res.status(201).json({
      message: "Banding berhasil diajukan",
      data: banding
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const getBandingSaya = async (req, res) => {
  try {
    const id_user = req.user.id_user;

    const data = await BandingAsesmen.findAll({
      where: { id_user },
      include: [
        { model: Jadwal, as: "jadwal" },
        { model: Skema, as: "skema" }
      ],
      order: [["tanggal_ajukan", "DESC"]]
    });

    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  ajukanBanding,
  getBandingSaya
};
