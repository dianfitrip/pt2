const { User } = require("../../models");
const { sendAccountEmail } = require("../../services/email.service");
const { createNotifikasi } = require("../../services/notifikasi.service");
const { resetUserPassword } = require("../../services/account.service");
const response = require("../../utils/response.util");

exports.sendAccountEmailManual = async (req, res) => {
  try {

    const user = await User.findByPk(req.params.id);

    if (!user)
      return response.error(res, "User tidak ditemukan", 404);

    const rawPassword = await resetUserPassword(user);

    let statusKirim = "terkirim";

    try {
      await sendAccountEmail(
        user.email,
        user.username,
        rawPassword
      );
    } catch (err) {
      console.error("Email gagal:", err.message);
      statusKirim = "gagal";
    }

    await createNotifikasi({
      channel: "email",
      tujuan: user.email,
      pesan: `Akun berhasil dikirim ulang. Username: ${user.username}`,
      status_kirim: statusKirim,
      ref_type: "akun",
      ref_id: user.id_user
    });

    return response.success(res, "Email akun berhasil dikirim");

  } catch (err) {
    return response.error(res, err.message);
  }
};