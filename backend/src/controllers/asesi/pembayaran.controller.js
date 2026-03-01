const AplikasiAsesmen = require("../../models/apl01Asesmen.model");
const Skema = require("../../models/skema.model");
const TujuanTransfer = require("../../models/tujuanPembayaran.model");
const Pembayaran = require("../../models/pembayaran.model");
const response = require("../../utils/response.util");

exports.getDetailPembayaran = async (req, res) => {
  try {
    const { id_aplikasi } = req.params;

    const aplikasi = await AplikasiAsesmen.findOne({
      where: { id_aplikasi, id_user: req.user.id_user },
      include: [{ model: Skema, attributes: ["judul_skema", "harga"] }]
    });
    if (!aplikasi) {
      return response.error(res, "Aplikasi tidak ditemukan", 404);
    }

    const tujuanTransfer = await TujuanTransfer.findAll({ where: { status: "aktif" } });

    response.success(res, "Detail pembayaran", {
      skema: aplikasi.skema.judul_skema,
      harga: aplikasi.skema.harga,
      tujuan_transfer: tujuanTransfer
    });
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.submitPembayaran = async (req, res) => {
  try {
    const { id_aplikasi, metode_pembayaran, jalur_pembayaran, id_tujuan_transfer } = req.body;

    if (!id_aplikasi || !metode_pembayaran) {
      return response.error(res, "ID aplikasi dan metode pembayaran wajib", 400);
    }
    if (metode_pembayaran === "Transfer Rekening" && (!jalur_pembayaran || !id_tujuan_transfer)) {
      return response.error(res, "Jalur pembayaran dan tujuan transfer wajib untuk Transfer Rekening", 400);
    }
    if (metode_pembayaran === "Tunai" && jalur_pembayaran !== "Tunai") {
      return response.error(res, "Jalur pembayaran harus Tunai jika metode Tunai", 400);
    }

    const aplikasi = await AplikasiAsesmen.findOne({
      where: { id_aplikasi, id_user: req.user.id_user },
      include: [{ model: Skema, attributes: ["harga"] }]
    });
    if (!aplikasi) {
      return response.error(res, "Aplikasi tidak ditemukan", 404);
    }

    const existing = await Pembayaran.findOne({ where: { id_aplikasi, status: "pending" } });
    if (existing) {
      return response.error(res, "Pembayaran sudah ada dan masih pending", 409);
    }

    const waktuBatas = new Date(Date.now() + 30 * 60 * 1000);

    const pembayaran = await Pembayaran.create({
      id_aplikasi,
      metode_pembayaran,
      jalur_pembayaran,
      id_tujuan_transfer,
      nominal: aplikasi.skema.harga,
      waktu_batas: waktuBatas
    });

    let tujuanDetail = null;
    if (id_tujuan_transfer) {
      tujuanDetail = await TujuanTransfer.findByPk(id_tujuan_transfer);
    }

    const struk = {
      id_pembayaran: pembayaran.id_pembayaran,
      skema: aplikasi.skema.judul_skema,
      metode_pembayaran,
      jalur_pembayaran,
      tujuan_transfer: tujuanDetail,
      nominal: aplikasi.skema.harga,
      waktu_pembayaran: pembayaran.waktu_pembayaran,
      waktu_batas: pembayaran.waktu_batas,
      nomor_rekening: tujuanDetail ? tujuanDetail.nomor_rekening : null,
      instruksi: "Bayar dalam 30 menit. Setelah bayar, upload bukti jika diperlukan."
    };

    response.success(res, "Konfirmasi pembayaran berhasil. Lakukan pembayaran sesuai struk.", struk);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.uploadBuktiBayar = async (req, res) => {
  try {
    const { id_pembayaran } = req.params;
    const files = req.files;

    const pembayaran = await Pembayaran.findOne({
      where: { id_pembayaran },
      include: [{ model: AplikasiAsesmen, where: { id_user: req.user.id_user } }]
    });
    if (!pembayaran) {
      return response.error(res, "Pembayaran tidak ditemukan", 404);
    }

    let buktiPath = null;
    if (files && files.bukti_bayar && files.bukti_bayar[0]) {
      buktiPath = files.bukti_bayar[0].path;
    }

    await pembayaran.update({
      status: "paid",
      bukti_bayar: buktiPath
    });

    response.success(res, "Bukti bayar berhasil diupload. Status pembayaran: Paid.", pembayaran);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getStatusPembayaran = async (req, res) => {
  try {
    const { id_aplikasi } = req.params;

    const pembayaran = await Pembayaran.findOne({
      where: { id_aplikasi },
      include: [{ model: AplikasiAsesmen, where: { id_user: req.user.id_user } }]
    });
    if (!pembayaran) {
      return response.error(res, "Pembayaran tidak ditemukan", 404);
    }

    response.success(res, "Status pembayaran", pembayaran);
  } catch (err) {
    response.error(res, err.message);
  }
};