const UnitKompetensi = require("../../models/unitKompetensi.model");
const Skkni = require("../../models/skkni.model");
const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const data = await UnitKompetensi.create(req.body);
    return response.success(res, "Unit kompetensi berhasil dibuat", data);
  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await UnitKompetensi.findAll({
      include: {
        model: Skkni,
        attributes: ["id_skkni", "judul_skkni"]
      }
    });

    return response.success(res, "List unit kompetensi", data);
  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await UnitKompetensi.findByPk(req.params.id, {
      include: {
        model: Skkni,
        attributes: ["id_skkni", "judul_skkni"]
      }
    });

    if (!data) {
      return response.error(res, "Unit kompetensi tidak ditemukan", 404);
    }

    return response.success(res, "Detail unit kompetensi", data);
  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const data = await UnitKompetensi.findByPk(req.params.id);

    if (!data) {
      return response.error(res, "Unit kompetensi tidak ditemukan", 404);
    }

    await data.update(req.body);

    return response.success(res, "Unit kompetensi berhasil diperbarui", data);
  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const data = await UnitKompetensi.findByPk(req.params.id);

    if (!data) {
      return response.error(res, "Unit kompetensi tidak ditemukan", 404);
    }

    await data.destroy();

    return response.success(res, "Unit kompetensi berhasil dihapus");
  } catch (err) {
    return response.error(res, err.message);
  }
};