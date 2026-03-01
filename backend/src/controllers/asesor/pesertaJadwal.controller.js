const { PesertaJadwal, User, Jadwal } = require("../../models");

const getPesertaByJadwal = async (req, res) => {
  try {
    const { id_jadwal } = req.params;

    const data = await PesertaJadwal.findAll({
      where: { id_jadwal },
      include: [
        { model: User, as: "user" },
        { model: Jadwal, as: "jadwal" }
      ]
    });

    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const updateNilaiPeserta = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_asesmen, nilai_akhir, keterangan } = req.body;

    const peserta = await PesertaJadwal.findByPk(id);
    if (!peserta) {
      return res.status(404).json({ message: "Peserta tidak ditemukan" });
    }

    await peserta.update({
      status_asesmen,
      nilai_akhir,
      keterangan
    });

    res.json({ message: "Nilai peserta berhasil diupdate", data: peserta });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  getPesertaByJadwal,
  updateNilaiPeserta
};
