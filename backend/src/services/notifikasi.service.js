const { Notifikasi } = require("../models");

exports.createNotifikasi = async ({
  channel,
  tujuan,
  pesan,
  status_kirim,
  ref_type,
  ref_id
}) => {
  return await Notifikasi.create({
    channel,
    tujuan,
    pesan,
    waktu_kirim: new Date(),
    status_kirim,
    ref_type,
    ref_id
  });
};