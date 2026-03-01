const { BankSoalPG } = require("../../models");
const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const data = await BankSoalPG.create(req.body);
    response.success(res, "Opsi PG ditambahkan", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getBySoal = async (req, res) => {
  try {
    const data = await BankSoalPG.findAll({
      where: { id_soal: req.params.id_soal }
    });

    response.success(res, "List opsi PG", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await BankSoalPG.findByPk(req.params.id);
    if (!item) return response.error(res, "Opsi tidak ditemukan", 404);

    await item.destroy();
    response.success(res, "Opsi dihapus");
  } catch (err) {
    response.error(res, err.message);
  }
};