const ProfileAdmin = require("../../models/profileAdmin.model");
const response = require("../../utils/response.util");

exports.getProfile = async (req, res) => {
  try {
    const data = await ProfileAdmin.findByPk(req.user.id_user);
    response.success(res, "Profil admin", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    await ProfileAdmin.update(req.body, {
      where: { id_user: req.user.id_user }
    });
    response.success(res, "Profil admin diperbarui");
  } catch (err) {
    response.error(res, err.message);
  }
};
