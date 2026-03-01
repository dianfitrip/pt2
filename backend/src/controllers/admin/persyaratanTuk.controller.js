const {
  PersyaratanTuk,
  SkemaPersyaratanTuk
} = require("../../models");
const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const data = await PersyaratanTuk.create(req.body);
    response.success(res, "Persyaratan TUK berhasil ditambahkan", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await PersyaratanTuk.findAll();
    response.success(res, "List persyaratan TUK", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.attachToSkema = async (req, res) => {
  try {
    const { id_skema, id_persyaratan_tuk } = req.body;

    const data = await SkemaPersyaratanTuk.create({
      id_skema,
      id_persyaratan_tuk
    });

    response.success(res, "Persyaratan TUK berhasil dikaitkan ke skema", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.detachFromSkema = async (req, res) => {
  try {
    const { id_skema, id_persyaratan_tuk } = req.params;

    const deleted = await SkemaPersyaratanTuk.destroy({
      where: { id_skema, id_persyaratan_tuk }
    });

    if (!deleted)
      return response.error(res, "Data tidak ditemukan", 404);

    response.success(res, "Persyaratan TUK berhasil dilepas dari skema");
  } catch (err) {
    response.error(res, err.message);
  }
};
