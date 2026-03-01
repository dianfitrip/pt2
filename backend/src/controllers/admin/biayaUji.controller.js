const { BiayaUji } = require("../../models");
const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const data = await BiayaUji.create(req.body);
    response.success(res, "Biaya uji berhasil ditambahkan", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getBySkema = async (req, res) => {
  try {
    const data = await BiayaUji.findAll({
      where: { id_skema: req.params.id_skema }
    });
    response.success(res, "List biaya uji", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const biaya = await BiayaUji.findByPk(req.params.id);
    if (!biaya) return response.error(res, "Data tidak ditemukan", 404);

    await biaya.update(req.body);
    response.success(res, "Biaya uji diperbarui", biaya);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const biaya = await BiayaUji.findByPk(req.params.id);
    if (!biaya) return response.error(res, "Data tidak ditemukan", 404);

    await biaya.destroy();
    response.success(res, "Biaya uji dihapus");
  } catch (err) {
    response.error(res, err.message);
  }
};
