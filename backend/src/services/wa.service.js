const axios = require("axios");
const notifikasiService = require("./notifikasi.service");

const WA_API_URL = "https://api.fonnte.com/send";
const WA_API_KEY = process.env.WA_API_KEY;

exports.sendWA = async (no_hp, pesan, ref_type = null, ref_id = null) => {
  try {
    const response = await axios.post(
      WA_API_URL,
      {
        target: no_hp,
        message: pesan
      },
      {
        headers: {
          Authorization: WA_API_KEY
        }
      }
    );

    await notifikasiService.createNotifikasi({
      channel: "wa",
      tujuan: no_hp,
      pesan,
      status_kirim: "terkirim",
      ref_type,
      ref_id
    });

    return response.data;

  } catch (error) {
    console.error("❌ Gagal kirim WA:", error.message);

    await notifikasiService.createNotifikasi({
      channel: "wa",
      tujuan: no_hp,
      pesan,
      status_kirim: "gagal",
      ref_type,
      ref_id
    });

    throw error;
  }
};
