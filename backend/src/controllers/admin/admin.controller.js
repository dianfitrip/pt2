const response = require("../../utils/response.util");

exports.getDashboard = async (req, res) => {
  try {
    response.success(res, "Dashboard Admin");
  } catch (err) {
    response.error(res, err.message);
  }
};
