const { Mapa01, Mapa } = require("../../models");
const response = require("../../utils/response.util");

exports.createOrUpdate = async (req, res) => {
  try {
    const { id_mapa } = req.body;

    const existing = await Mapa01.findOne({ where: { id_mapa } });

    if (existing) {
      await existing.update(req.body);
      return response.success(res, "MAPA01 diperbarui", existing);
    }

    const data = await Mapa01.create(req.body);
    response.success(res, "MAPA01 dibuat", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getByMapa = async (req, res) => {
  try {
    const data = await Mapa01.findOne({
      where: { id_mapa: req.params.id_mapa },
      include: [{ model: Mapa }]
    });

    response.success(res, "Detail MAPA01", data);
  } catch (err) {
    response.error(res, err.message);
  }
};