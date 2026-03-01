const { Persyaratan } = require("../../models");
const response = require("../../utils/response.util");

exports.create = async (req, res) => {
  try {
    const data = await Persyaratan.create(req.body);
    response.success(res, "Persyaratan berhasil ditambahkan", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Persyaratan.findAll();
    response.success(res, "List persyaratan", data);
  } catch (err) {
    response.error(res, err.message);
  }
};
