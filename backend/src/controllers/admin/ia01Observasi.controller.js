const { IA01Observasi } = require("../../models");
const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const data = await IA01Observasi.create(req.body);
    response.success(res, "Observasi ditambahkan", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getByUnit = async (req, res) => {
  try {
    const data = await IA01Observasi.findAll({
      where: { id_unit: req.params.id_unit },
      order: [["urutan", "ASC"]]
    });

    response.success(res, "List observasi", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await IA01Observasi.findByPk(req.params.id);
    if (!item) return response.error(res, "Data tidak ditemukan", 404);

    await item.destroy();
    response.success(res, "Observasi dihapus");
  } catch (err) {
    response.error(res, err.message);
  }
};