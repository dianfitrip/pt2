const bcrypt = require("bcryptjs");
const Pendaftaran = require("../../models/pendaftaranAsesi.model");
const ProfileAsesi = require("../../models/profileAsesi.model");
const Role = require("../../models/role.model");
const User = require("../../models/user.model");
const Notifikasi = require("../../models/notifikasi.model");
const { sendAccountEmail } = require("../../services/email.service");
const response = require("../../utils/response.util");
const sequelize = require("../../config/database");

exports.getAll = async (req, res) => {
  try {
    const data = await Pendaftaran.findAll({
      order: [["tanggal_daftar", "DESC"]]
    });

    response.success(res, "List pendaftaran asesi", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.approvePendaftaran = async (req, res) => {

  const t = await sequelize.transaction();

  try {

    const pendaftaran = await Pendaftaran.findByPk(req.params.id, { transaction: t });

    if (!pendaftaran) {
      await t.rollback();
      return response.error(res, "Data tidak ditemukan", 404);
    }

    if (pendaftaran.status !== "pending") {
      await t.rollback();
      return response.error(res, "Pendaftaran sudah diproses", 400);
    }

    const roleAsesi = await Role.findOne({
      where: { role_name: "ASESI" },
      transaction: t
    });

    if (!roleAsesi) {
      await t.rollback();
      return response.error(res, "Role ASESI tidak ditemukan", 500);
    }

    const { createUser } = require("../../services/account.service");

    const { user, rawPassword } =
      await createUser({
        username: pendaftaran.nik,
        email: pendaftaran.email,
        no_hp: pendaftaran.no_hp,
        id_role: roleAsesi.id_role
      }, { transaction: t });

    await ProfileAsesi.create({
      id_user: user.id_user,
      nik: pendaftaran.nik,
      nama_lengkap: pendaftaran.nama_lengkap,
      provinsi: pendaftaran.provinsi,
      kota: pendaftaran.kota,
      kecamatan: pendaftaran.kecamatan,
      kelurahan: pendaftaran.kelurahan
    }, { transaction: t });

    await pendaftaran.update({
      status: "approved"
    }, { transaction: t });

    await t.commit();

    let statusKirim = "terkirim";

    try {
      await sendAccountEmail(
        user.email,
        user.username,
        rawPassword
      );
    } catch (err) {
      statusKirim = "gagal";
    }

    await createNotifikasi({
      channel: "email",
      tujuan: user.email,
      pesan: `Akun asesi berhasil dibuat. Username: ${user.username}`,
      status_kirim: statusKirim,
      ref_type: "akun",
      ref_id: user.id_user
    });

    return response.success(res, "Pendaftaran berhasil di-approve");

  } catch (err) {
    await t.rollback();
    return response.error(res, err.message);
  }
};

exports.rejectPendaftaran = async (req, res) => {
  try {
    const pendaftaran = await Pendaftaran.findByPk(req.params.id);

    if (!pendaftaran) {
      return response.error(res, "Data tidak ditemukan", 404);
    }

    if (pendaftaran.status !== "pending") {
      return response.error(
        res,
        "Pendaftaran sudah diproses sebelumnya",
        400
      );
    }

    await pendaftaran.update({
      status: "rejected"
    });

    await Notifikasi.create({
      channel: "email",
      tujuan: pendaftaran.email,
      pesan: "Pendaftaran Anda ditolak oleh admin",
      waktu_kirim: new Date(),
      status_kirim: "terkirim",
      ref_type: "pendaftaran",
      ref_id: pendaftaran.id_pendaftaran
    });

    return response.success(res, "Pendaftaran berhasil ditolak");
  } catch (err) {
    console.error(err);
    return response.error(res, err.message);
  }
};
