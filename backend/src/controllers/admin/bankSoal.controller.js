const { BankSoal, UnitKompetensi } = require("../../models");
const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const data = await BankSoal.create(req.body);
    response.success(res, "Soal berhasil dibuat", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await BankSoal.findAll({
      include: [UnitKompetensi],
      order: [["id_soal", "DESC"]]
    });

    response.success(res, "List bank soal", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const soal = await BankSoal.findByPk(req.params.id);
    if (!soal) return response.error(res, "Soal tidak ditemukan", 404);

    await soal.update(req.body);
    response.success(res, "Soal diperbarui", soal);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const soal = await BankSoal.findByPk(req.params.id);
    if (!soal) return response.error(res, "Soal tidak ditemukan", 404);

    await soal.destroy();
    response.success(res, "Soal dihapus");
  } catch (err) {
    response.error(res, err.message);
  }
};