const { PesertaJadwal, User, Jadwal } = require("../../models");
const response = require("../../utils/response.util");

const getPesertaByJadwal = async (req, res) => {
  try {
    const { id_jadwal } = req.params;

    const data = await PesertaJadwal.findAll({
      where: { id_jadwal },
      include: [
        { model: User, as: "user" },
        { model: Jadwal, as: "jadwal" }
      ]
    });

    return response.success(res, "List peserta jadwal", data);
  } catch (err) {
    console.error(err);
    return response.error(res, err.message);
  }
};

module.exports = {
  getPesertaByJadwal
};