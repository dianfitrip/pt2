const { Jadwal, Tuk } = require("../../models");

exports.getAllPublic = async (req, res) => {
  try {
    const data = await Jadwal.findAll({
      where: { status: "open" },
      include: [
        {
          model: Tuk,
          as: "tuk",
          attributes: ["nama_tuk", "kota", "provinsi"]
        }
      ],
      order: [["tgl_awal", "ASC"]],
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil jadwal publik" });
  }
};