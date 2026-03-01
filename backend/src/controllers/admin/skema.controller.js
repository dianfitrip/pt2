const {
  Skema,
  Skkni,
  BiayaUji,
  Persyaratan,
  PersyaratanTuk,
  KelompokPekerjaan,
  Tuk
} = require("../../models");

const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const data = await Skema.create(req.body);
    response.success(res, "Skema berhasil dibuat", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Skema.findAll({
      include: [
        { model: Skkni },
        { model: Persyaratan } 
      ],
      order: [['id_skema', 'DESC']]
    });
    response.success(res, "List skema", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getDetail = async (req, res) => {
  try {
    const data = await Skema.findByPk(req.params.id, {
      include: [
        Skkni,
        BiayaUji,
        Persyaratan,
        PersyaratanTuk,
        KelompokPekerjaan,
        Tuk
      ]
    });

    if (!data) return response.error(res, "Skema tidak ditemukan", 404);
    response.success(res, "Detail skema", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const skema = await Skema.findByPk(req.params.id);
    if (!skema) return response.error(res, "Skema tidak ditemukan", 404);

    await skema.update(req.body);
    response.success(res, "Skema berhasil diperbarui", skema);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const skema = await Skema.findByPk(req.params.id);
    if (!skema) return response.error(res, "Skema tidak ditemukan", 404);

    await skema.destroy();
    response.success(res, "Skema berhasil dihapus");
  } catch (err) {
    response.error(res, err.message);
  }
};
