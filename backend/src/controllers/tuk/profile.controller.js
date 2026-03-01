const ProfileTuk = require("../../models/profileTuk.model");
const response = require("../../utils/response.util");

exports.getProfile = async (req, res) => {
  try {
    const data = await ProfileTuk.findByPk(req.user.id_user);
    response.success(res, "Profil TUK", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    await ProfileTuk.update(req.body, {
      where: { id_user: req.user.id_user }
    });
    response.success(res, "Profil TUK diperbarui");
  } catch (err) {
    response.error(res, err.message);
  }
};
