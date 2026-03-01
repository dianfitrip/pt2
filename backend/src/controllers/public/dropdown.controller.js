const { Jadwal, Tuk, Skema} = require("../../models");

exports.getWilayahUjiDropdown = async (req, res) => {
  try {
    const data = await Jadwal.findAll({
      where: { status: "open" },
      attributes: ["id_jadwal", "nama_kegiatan"],
      include: [
        {
          model: Tuk,
          as: "tuk",
          attributes: ["id_tuk", "nama_tuk", "kota", "provinsi"],
        },
      ],
      order: [["tgl_awal", "ASC"]],
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal ambil wilayah uji" });
  }
};


exports.getSkemaDropdown = async (req, res) => {
  try {
    const data = await Skema.findAll({
      where: { status: "aktif" },
      attributes: ["id_skema", "judul_skema"],
      order: [["judul_skema", "ASC"]],
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil skema" });
  }
};
