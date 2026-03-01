const UnitKompetensi = require("../../models/unitKompetensi.model");
const Skkni = require("../../models/skkni.model");
const response = require("../../utils/response.util");

exports.getBySkkni = async (req, res) => {
  try {
    const { id_skkni } = req.params;

    const data = await UnitKompetensi.findAll({
      where: { id_skkni },
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

exports.getDetail = async (req, res) => {
  try {
    const data = await UnitKompetensi.findByPk(req.params.id);

    if (!data) {
      return response.error(res, "Unit kompetensi tidak ditemukan", 404);
    }

    return response.success(res, "Detail unit kompetensi", data);
  } catch (err) {
    return response.error(res, err.message);
  }
};
