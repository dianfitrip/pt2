const { Mapa, Skema, User } = require("../../models");
const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const data = await Mapa.create({
      ...req.body,
      created_by: req.user.id_user
    });

    response.success(res, "MAPA berhasil dibuat", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Mapa.findAll({
      include: [
        { model: Skema },
        { model: User, as: "creator", attributes: ["id_user", "username"] }
      ],
      order: [["created_at", "DESC"]]
    });

    response.success(res, "List MAPA", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Mapa.findByPk(req.params.id, {
      include: [
        { model: Skema },
        { model: User, as: "creator" }
      ]
    });

    if (!data) return response.error(res, "MAPA tidak ditemukan", 404);
    response.success(res, "Detail MAPA", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const mapa = await Mapa.findByPk(req.params.id);
    if (!mapa) return response.error(res, "MAPA tidak ditemukan", 404);

    await mapa.update(req.body);
    response.success(res, "MAPA diperbarui", mapa);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  try {
    const mapa = await Mapa.findByPk(req.params.id);
    if (!mapa) return response.error(res, "MAPA tidak ditemukan", 404);

    await mapa.destroy();
    response.success(res, "MAPA dihapus");
  } catch (err) {
    response.error(res, err.message);
  }
};