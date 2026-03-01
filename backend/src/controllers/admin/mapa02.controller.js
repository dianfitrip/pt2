const { Mapa02Mapping, Mapa02Metode, UnitKompetensi,KelompokPekerjaan} = require("../../models");
const response = require("../../utils/response.util");

exports.addMapping = async (req, res) => {
  try {
    const data = await Mapa02Mapping.create(req.body);
    response.success(res, "Mapping unit ditambahkan", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getMappingByMapa = async (req, res) => {
  try {
    const data = await Mapa02Mapping.findAll({
      where: { id_mapa: req.params.id_mapa },
      include: [UnitKompetensi, KelompokPekerjaan],
      order: [["id_mapping", "ASC"]]
    });

    response.success(res, "List mapping MAPA02", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.deleteMapping = async (req, res) => {
  try {
    const item = await Mapa02Mapping.findByPk(req.params.id);
    if (!item) return response.error(res, "Mapping tidak ditemukan", 404);

    await item.destroy();
    response.success(res, "Mapping dihapus");
  } catch (err) {
    response.error(res, err.message);
  }
};

// ===== METODE =====

exports.addMetode = async (req, res) => {
  try {
    const data = await Mapa02Metode.create(req.body);
    response.success(res, "Metode ditambahkan", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getMetodeByMapping = async (req, res) => {
  try {
    const data = await Mapa02Metode.findAll({
      where: { id_mapping: req.params.id_mapping }
    });

    response.success(res, "List metode", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.deleteMetode = async (req, res) => {
  try {
    const item = await Mapa02Metode.findByPk(req.params.id);
    if (!item) return response.error(res, "Metode tidak ditemukan", 404);

    await item.destroy();
    response.success(res, "Metode dihapus");
  } catch (err) {
    response.error(res, err.message);
  }
};