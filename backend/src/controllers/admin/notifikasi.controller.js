const Notifikasi = require("../../models/notifikasi.model");
const response = require("../../utils/response.util");

exports.getAll = async (req, res) => {
  try {
    const data = await Notifikasi.findAll();
    response.success(res, "List notifikasi", data);
  } catch (err) {
    response.error(res, err.message);
  }
};
