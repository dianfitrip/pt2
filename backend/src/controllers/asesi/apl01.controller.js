const Skema = require("../../models/skema.model");
const SkemaPersyaratan = require("../../models/skemaPersyaratan.model");
const Skkni = require("../../models/skkni.model");
const UnitKompetensi = require("../../models/unitKompetensi.model");
const AplikasiAsesmen = require("../../models/apl01Asesmen.model");
const Pembayaran = require("../../models/pembayaran.model");  
const response = require("../../utils/response.util");

exports.getSkema = async (req, res) => {
  try {
    const data = await Skema.findAll({ where: { status: "aktif" } });
    response.success(res, "List skema aktif", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getPersyaratanBySkema = async (req, res) => {
  try {
    const { id_skema } = req.params;
    const data = await SkemaPersyaratan.findAll({ where: { id_skema } });
    response.success(res, "Persyaratan skema", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getSkkni = async (req, res) => {
  try {
    const data = await Skkni.findAll();
    response.success(res, "List SKKNI", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getUnitKompetensiBySkkni = async (req, res) => {
  try {
    const { id_skkni } = req.params;
    const data = await UnitKompetensi.findAll({ where: { id_skkni } });
    response.success(res, "Unit kompetensi", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.submitAplikasi = async (req, res) => {
  try {
    const { id_skema, selected_persyaratan, dokumen_tambahan, tujuan_asesmen, tujuan_asesmen_lainnya, selected_units } = req.body;
    const files = req.files;

    if (!id_skema || !tujuan_asesmen) {
      return response.error(res, "ID skema dan tujuan asesmen wajib diisi", 400);
    }

    const pembayaran = await Pembayaran.findOne({
      include: [
        {
          model: AplikasiAsesmen,
          where: { id_user: req.user.id_user, id_skema, status: ["draft", "submitted"] },
          required: true
        }
      ],
      where: { status: "paid" }
    });
    if (!pembayaran) {
      return response.error(res, "Pembayaran untuk skema ini belum dilakukan atau belum dikonfirmasi. Selesaikan pembayaran terlebih dahulu.", 403);
    }

    let dokumenPaths = [];
    if (files.dokumen_tambahan) {
      files.dokumen_tambahan.forEach((file, index) => {
        dokumenPaths.push({
          file_path: file.path,
          nomor_dokumen: req.body[`nomor_dokumen_${index}`] || null,
          tanggal_dokumen: req.body[`tanggal_dokumen_${index}`] || null
        });
      });
    }

    let tandaTanganPath = null;
    if (files.tanda_tangan && files.tanda_tangan[0]) {
      tandaTanganPath = files.tanda_tangan[0].path;
    }

    const aplikasi = await AplikasiAsesmen.create({
      id_user: req.user.id_user,
      id_skema,
      selected_persyaratan: selected_persyaratan ? JSON.parse(selected_persyaratan) : [],
      dokumen_tambahan: dokumenPaths,
      tujuan_asesmen,
      tujuan_asesmen_lainnya: tujuan_asesmen === "Lainnya" ? tujuan_asesmen_lainnya : null,
      selected_units: selected_units ? JSON.parse(selected_units) : [],
      tanda_tangan: tandaTanganPath,
      status: "submitted"
    });

    response.success(res, "Aplikasi asesmen berhasil disubmit", aplikasi);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getAplikasi = async (req, res) => {
  try {
    const data = await AplikasiAsesmen.findAll({
      where: { id_user: req.user.id_user },
      include: [{ model: Skema, as: "skema" }]
    });
    response.success(res, "Aplikasi asesi", data);
  } catch (err) {
    response.error(res, err.message);
  }
};