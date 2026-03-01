const { Tuk, TukSkema } = require("../../models");
const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const data = await Tuk.create(req.body);
    response.success(res, "TUK berhasil ditambahkan", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Tuk.findAll();
    response.success(res, "List TUK", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const tuk = await Tuk.findByPk(req.params.id);
    if (!tuk) return response.error(res, "TUK tidak ditemukan", 404);

    await tuk.update(req.body);
    response.success(res, "TUK diperbarui", tuk);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const tuk = await Tuk.findByPk(req.params.id);
    if (!tuk) return response.error(res, "TUK tidak ditemukan", 404);

    await tuk.destroy();
    response.success(res, "TUK dihapus");
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.attachSkema = async (req, res) => {
  try {
    const { id_tuk, id_skema } = req.body;

    const data = await TukSkema.create({
      id_tuk,
      id_skema
    });

    response.success(res, "Skema berhasil dikaitkan ke TUK", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.detachSkema = async (req, res) => {
  try {
    const { id_tuk, id_skema } = req.params;

    const deleted = await TukSkema.destroy({
      where: { id_tuk, id_skema }
    });

    if (!deleted)
      return response.error(res, "Relasi tidak ditemukan", 404);

    response.success(res, "Skema dilepas dari TUK");
  } catch (err) {
    response.error(res, err.message);
  }
};
