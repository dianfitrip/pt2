const XLSX = require("xlsx");
const { User, ProfileAsesor, Role, Notifikasi } = require("../../models");
const response = require("../../utils/response.util");
const { createUser  } = require("../../services/account.service");
const { resetUserPassword } = require("../../services/account.service");
const sequelize = require("../../config/database");


exports.createAsesor = async (req, res) => {

  const t = await sequelize.transaction();

  try {

    const { nik, email, no_hp, ...profile } = req.body;

    const role = await Role.findOne({
      where: { role_name: "ASESOR" },
        transaction: t
    });

    if (!role) {
      await t.rollback();
      return response.error(res, "Role ASESOR tidak ditemukan", 500);
    }

    const { user } =
      await createUser({
        username: nik,
        email,
        no_hp,
        id_role: role.id_role
      }, { transaction: t });

    await ProfileAsesor.create({
      id_user: user.id_user,
      nik,
      ...profile
    }, { transaction: t });

    await t.commit();

    return response.success(
      res,
      "Asesor berhasil dibuat. Email belum dikirim."
    );

  } catch (err) {

    await t.rollback();
    return response.error(res, err.message);
  }
};

exports.importAsesorExcel = async (req, res) => {
  try {

    if (!req.file) {
      return response.error(res, "File tidak ditemukan", 400);
    }

    // 🔹 Baca file Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data.length) {
      return response.error(res, "File Excel kosong", 400);
    }

    // 🔹 Ambil Role ASESOR
    const role = await Role.findOne({
      where: { role_name: "ASESOR" }
    });

    if (!role) {
      return response.error(res, "Role ASESOR tidak ditemukan", 500);
    }

    let totalSuccess = 0;
    let totalFailed = 0;

    for (const row of data) {

      const t = await sequelize.transaction();

      try {

        // 🔹 Validasi minimal
        if (!row.nik || !row.email) {
          throw new Error("NIK atau Email kosong");
        }

        // 🔹 Buat User (TANPA NOTIFIKASI)
        const { user } = await createUser({
          username: row.nik,
          email: row.email,
          no_hp: row.no_hp || null,
          id_role: role.id_role
        }, { transaction: t });

        // 🔹 Buat Profile Asesor
        await ProfileAsesor.create({
          id_user: user.id_user,
          nik: row.nik,
          gelar_depan: row.gelar_depan || null,
          nama_lengkap: row.nama_lengkap,
          gelar_belakang: row.gelar_belakang || null,
          jenis_kelamin: row.jenis_kelamin,
          tempat_lahir: row.tempat_lahir,
          tanggal_lahir: row.tanggal_lahir,
          kebangsaan: row.kebangsaan,
          pendidikan_terakhir: row.pendidikan_terakhir,
          tahun_lulus: row.tahun_lulus,
          institut_asal: row.institut_asal,
          alamat: row.alamat,
          rt: row.rt,
          rw: row.rw,
          provinsi: row.provinsi,
          kota: row.kota,
          kecamatan: row.kecamatan,
          kelurahan: row.kelurahan,
          kode_pos: row.kode_pos,
          bidang_keahlian: row.bidang_keahlian,
          no_reg_asesor: row.no_reg_asesor,
          no_lisensi: row.no_lisensi,
          masa_berlaku: row.masa_berlaku,
          status_asesor: row.status_asesor
        }, { transaction: t });

        await t.commit();
        totalSuccess++;

      } catch (err) {

        await t.rollback();
        totalFailed++;

        console.error(
          `Gagal import asesor NIK ${row.nik}:`,
          err.message
        );
      }
    }

    return response.success(
      res,
      `Import selesai. Berhasil: ${totalSuccess}, Gagal: ${totalFailed}`
    );

  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.getAll = async (req, res) => {
  try {

    const data = await ProfileAsesor.findAll({
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

    return response.success(res, "List Asesor", data);

  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await ProfileAsesor.findByPk(req.params.id, {
      include: User
    });

    if (!data) return response.error(res, "Asesor tidak ditemukan", 404);

    return response.success(res, "Detail Asesor", data);
  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.update = async (req, res) => {
  try {

    const asesor = await ProfileAsesor.findByPk(req.params.id);
    if (!asesor) return response.error(res, "Asesor tidak ditemukan", 404);

    await asesor.update(req.body);

    return response.success(res, "Asesor berhasil diperbarui", asesor);

  } catch (err) {
    return response.error(res, err.message);
  }
};

exports.delete = async (req, res) => {
  const t = await sequelize.transaction();
  try {

    const asesor = await ProfileAsesor.findByPk(req.params.id, { transaction: t });
    if (!asesor) {
      await t.rollback();
      return response.error(res, "Asesor tidak ditemukan", 404);
    }

    const today = new Date();

    if (asesor.masa_berlaku) {
      const masaBerlaku = new Date(asesor.masa_berlaku);
      if (masaBerlaku >= today) {
        await t.rollback();
        return response.error(
          res,
          "Asesor masih aktif dan tidak bisa dihapus",
          400
        );
      }
    }

    await User.destroy({
      where: { id_user: asesor.id_user },
      transaction: t
    });


    await asesor.destroy({ transaction: t });

    await t.commit();
    return response.success(res, "Asesor berhasil dihapus");

  } catch (err) {
    await t.rollback();
    return response.error(res, err.message);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user)
      return response.error(res, "User tidak ditemukan", 404);

    const rawPassword = await resetUserPassword(user);

    return response.success(res, "Password berhasil direset", {
      username: user.username,
      password: rawPassword
    });

  } catch (err) {
    return response.error(res, err.message);
  }
};