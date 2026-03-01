const { IA03Pertanyaan } = require("../../models");
const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const data = await IA03Pertanyaan.create(req.body);
    response.success(res, "Pertanyaan IA03 ditambahkan", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getByUnit = async (req, res) => {
  try {
    const data = await IA03Pertanyaan.findAll({
      where: { id_unit: req.params.id_unit }
    });

    response.success(res, "List pertanyaan IA03", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await IA03Pertanyaan.findByPk(req.params.id);
    if (!item) return response.error(res, "Data tidak ditemukan", 404);

    await item.destroy();
    response.success(res, "Pertanyaan dihapus");
  } catch (err) {
    response.error(res, err.message);
  }
};