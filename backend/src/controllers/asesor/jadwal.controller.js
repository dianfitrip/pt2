const { JadwalAsesor, Jadwal } = require("../../models");

const getJadwalSaya = async (req, res) => {
  try {
    const id_user = req.user.id_user;

    const data = await JadwalAsesor.findAll({
      where: { id_user },
      include: [
        {
          model: Jadwal,
          as: "jadwal"
        }
      ],
      order: [["created_at", "DESC"]]
    });

    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  getJadwalSaya
};
