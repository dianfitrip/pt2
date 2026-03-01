const XLSX = require("xlsx");
const { User, ProfileTuk, Role, Notifikasi } = require("../../models");
const response = require("../../utils/response.util");
const { createUser } = require("../../services/account.service");
const sequelize = require("../../config/database");

exports.createTuk = async (req, res) => {

  const t = await sequelize.transaction();

  try {

    const { kode_tuk, email, no_hp, ...profile } = req.body;

    const role = await Role.findOne({
      where: { role_name: "TUK" }
    });

    if (!role) {
      await t.rollback();
      return response.error(res, "Role TUK tidak ditemukan", 500);
    }

    const { user } = await createUser({
      username: kode_tuk,
      email,
      no_hp,
      id_role: role.id_role
    }, { transaction: t });

    await ProfileTuk.create({
      id_user: user.id_user,
      kode_tuk,
      ...profile
    }, { transaction: t });

    await t.commit();

    return response.success(
      res,
      "Akun TUK berhasil dibuat. Email belum dikirim."
    );

  } catch (err) {

    await t.rollback();
    return response.error(res, err.message);
  }
};

exports.importTukExcel = async (req, res) => {

  try {

    if (!req.file) {
      return response.error(res, "File tidak ditemukan", 400);
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data.length) {
      return response.error(res, "File Excel kosong", 400);
    }

    const role = await Role.findOne({
      where: { role_name: "TUK" }
    });

    if (!role) {
      return response.error(res, "Role TUK tidak ditemukan", 500);
    }

    let totalSuccess = 0;
    let totalFailed = 0;

    for (const row of data) {

      const t = await sequelize.transaction();

      try {

        if (!row.kode_tuk || !row.email) {
          throw new Error("Kode TUK atau Email kosong");
        }

        const { user } = await createUser({
          username: row.kode_tuk,
          email: row.email,
          no_hp: row.no_hp || null,
          id_role: role.id_role
        }, { transaction: t });

        await ProfileTuk.create({
          id_user: user.id_user,
          kode_tuk: row.kode_tuk,
          nama_tuk: row.nama_tuk,
          jenis_tuk: row.jenis_tuk,
          alamat: row.alamat,
          provinsi: row.provinsi,
          kota: row.kota,
          kecamatan: row.kecamatan,
          kelurahan: row.kelurahan,
          kode_pos: row.kode_pos,
          no_izin: row.no_izin,
          masa_berlaku: row.masa_berlaku,
          status_tuk: row.status_tuk
        }, { transaction: t });

        await t.commit();
        totalSuccess++;

      } catch (err) {

        await t.rollback();
        totalFailed++;

        console.error("Gagal import TUK:", row.kode_tuk, err.message);
      }
    }

    return response.success(
      res,
      `Import TUK selesai. Berhasil: ${totalSuccess}, Gagal: ${totalFailed}`
    );

  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.getAll = async (req, res) => {
  try {

    const data = await ProfileTuk.findAll({
      include: [
        {
          model: User,
          attributes: ["id_user", "email", "no_hp", "status_user"],
          include: [
            {
              model: Notifikasi,
              where: { ref_type: "akun" },
              required: false
            }
          ]
        }
      ]
    });

    return response.success(res, "List TUK", data);

  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await ProfileTuk.findByPk(req.params.id, {
      include: User
    });

    if (!data) return response.error(res, "TUK tidak ditemukan", 404);

    return response.success(res, "Detail TUK", data);
  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {

    const tuk = await ProfileTuk.findByPk(req.params.id);
    if (!tuk) return response.error(res, "TUK tidak ditemukan", 404);

    await tuk.update(req.body);

    return response.success(res, "TUK berhasil diperbarui", tuk);

  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  const t = await sequelize.transaction();
  try {

    const tuk = await ProfileTuk.findByPk(req.params.id, { transaction: t });
    if (!tuk) {
      await t.rollback();
      return response.error(res, "TUK tidak ditemukan", 404);
    }

    await User.destroy({
      where: { id_user: tuk.id_user },
      transaction: t
    });

    await tuk.destroy({ transaction: t });

    await t.commit();
    return response.success(res, "TUK berhasil dihapus");

  } catch (err) {
    await t.rollback();
    return response.error(res, err.message);
  }
};