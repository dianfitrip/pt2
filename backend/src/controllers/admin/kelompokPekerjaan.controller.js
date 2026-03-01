const { KelompokPekerjaan } = require("../../models");
const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const data = await KelompokPekerjaan.create(req.body);
    response.success(res, "Kelompok pekerjaan berhasil ditambahkan", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getBySkema = async (req, res) => {
  try {
    const data = await KelompokPekerjaan.findAll({
      where: { id_skema: req.params.id_skema },
      order: [["urutan", "ASC"]]
    });

    response.success(res, "Peta pekerjaan", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const item = await KelompokPekerjaan.findByPk(req.params.id);
    if (!item) return response.error(res, "Data tidak ditemukan", 404);

    await item.update(req.body);
    response.success(res, "Kelompok pekerjaan diperbarui", item);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await KelompokPekerjaan.findByPk(req.params.id);
    if (!item) return response.error(res, "Data tidak ditemukan", 404);

    await item.destroy();
    response.success(res, "Kelompok pekerjaan dihapus");
  } catch (err) {
    response.error(res, err.message);
  }
};
