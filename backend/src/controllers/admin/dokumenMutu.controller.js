const DokumenMutu = require("../../models/dokumenMutu.model");

const createDokumen = async (req, res) => {
  try {
    const body = { ...req.body };

    if (req.files?.file_dokumen) {
      body.file_dokumen = req.files.file_dokumen[0].filename;
    }

    if (req.files?.file_pendukung) {
      body.file_pendukung = req.files.file_pendukung[0].filename;
    }

    const data = await DokumenMutu.create(body);

    res.status(201).json({
      message: "Dokumen berhasil ditambah",
      data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


const getAllDokumen = async (req, res) => {
  try {
    const data = await DokumenMutu.findAll({
      order: [["created_at", "DESC"]]
    });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const updateDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const dok = await DokumenMutu.findByPk(id);

    if (!dok) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    const body = { ...req.body };

    if (req.files?.file_dokumen) {
      body.file_dokumen = req.files.file_dokumen[0].filename;
    }

    if (req.files?.file_pendukung) {
      body.file_pendukung = req.files.file_pendukung[0].filename;
    }

    await dok.update(body);

    res.json({
      message: "Dokumen berhasil diupdate",
      data: dok
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const deleteDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const dok = await DokumenMutu.findByPk(id);

    if (!dok) {
      return res.status(404).json({ message: "Dokumen tidak ditemukan" });
    }

    await dok.destroy();
    res.json({ message: "Dokumen berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  createDokumen,
  getAllDokumen,
  updateDokumen,
  deleteDokumen
};
