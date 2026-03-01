const { Tuk } = require("../../models");

exports.getAllPublic = async (req, res) => {
  try {
    const data = await Tuk.findAll({
      where: { status: "aktif" },
      attributes: ["id_tuk", "nama_tuk", "alamat", "kota", "provinsi"]
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil data TUK" });
  }
};