const AplikasiAsesmen = require("../../models/apl01Asesmen.model");
const UnitKompetensi = require("../../models/unitKompetensi.model");
const Apl02AsesmenMandiri = require("../../models/apl02AsesmenMandiri.model");
const Pembayaran = require("../../models/pembayaran.model");
const response = require("../../utils/response.util");

exports.getUnitsForApl02 = async (req, res) => {
  try {
    const { id_aplikasi } = req.params;

    const aplikasi = await AplikasiAsesmen.findOne({
      where: { id_aplikasi, id_user: req.user.id_user, status: ["draft", "submitted"] } 
    });
    if (!aplikasi) {
      return response.error(res, "Aplikasi tidak ditemukan, tidak milik Anda, atau tidak dalam status yang valid untuk APL02", 404);
    }

    const pembayaran = await Pembayaran.findOne({ where: { id_aplikasi, status: "paid" } });
    if (!pembayaran) {
      return response.error(res, "Pembayaran belum dilakukan atau belum dikonfirmasi. Selesaikan pembayaran terlebih dahulu.", 403);
    }

    const selectedUnits = aplikasi.selected_units || [];
    if (selectedUnits.length === 0) {
      return response.error(res, "Tidak ada unit kompetensi yang dipilih untuk aplikasi ini", 400);
    }

    const units = await UnitKompetensi.findAll({
      where: { id_unit: selectedUnits },
      attributes: ["id_unit", "kode_unit", "judul_unit", "elemen_kriteria"] 
    });

    const unitsWithNumbers = units.map((unit, unitIndex) => {
      const elemenKriteria = unit.elemen_kriteria;
      if (!elemenKriteria) return unit;

      const elemenNumber = `${unitIndex + 1}.1`;
      const elemenKompetensiWithNumber = `${elemenNumber}. ${elemenKriteria.elemen_kompetensi}`;

      const kriteriaWithNumbers = elemenKriteria.kriteria_unjuk_kerja.map((kriteria, kriteriaIndex) => {
        const kriteriaNumber = `${elemenNumber}.${kriteriaIndex + 1}`;
        return `${kriteriaNumber}. ${kriteria}`;
      });

      return {
        ...unit.toJSON(),
        elemen_kriteria: {
          elemen_kompetensi: elemenKompetensiWithNumber,
          kriteria_unjuk_kerja: kriteriaWithNumbers
        }
      };
    });

    response.success(res, "Unit kompetensi untuk APL02", unitsWithNumbers);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.submitApl02 = async (req, res) => {
  try {
    const { id_aplikasi, id_unit, elemen_kompetensi, kriteria_unjuk_kerja, jawaban, jenis_pengalaman, nama_dokumen, nomor_dokumen, tanggal_dokumen, catatan_bukti } = req.body;
    const files = req.files;

    if (!id_aplikasi || !id_unit || !elemen_kompetensi || !kriteria_unjuk_kerja || !jawaban || !jenis_pengalaman) {
      return response.error(res, "Semua field wajib diisi kecuali file dan catatan", 400);
    }

    const aplikasi = await AplikasiAsesmen.findOne({
      where: { id_aplikasi, id_user: req.user.id_user, status: ["draft", "submitted"] }
    });
    if (!aplikasi) {
      return response.error(res, "Aplikasi tidak ditemukan, tidak milik Anda, atau tidak dalam status yang valid", 404);
    }

    const pembayaran = await Pembayaran.findOne({ where: { id_aplikasi, status: "paid" } });
    if (!pembayaran) {
      return response.error(res, "Pembayaran belum dilakukan atau belum dikonfirmasi. Selesaikan pembayaran terlebih dahulu.", 403);
    }

    const selectedUnits = aplikasi.selected_units || [];
    if (!selectedUnits.includes(parseInt(id_unit))) {
      return response.error(res, "Unit kompetensi tidak valid untuk aplikasi ini", 400);
    }

    const existing = await Apl02AsesmenMandiri.findOne({
      where: { id_aplikasi, id_unit, kriteria_unjuk_kerja }
    });
    if (existing) {
      return response.error(res, "Jawaban untuk kriteria ini sudah ada. Gunakan update jika perlu.", 409);
    }

    let fileBuktiPath = null;
    if (files && files.file_bukti && files.file_bukti[0]) {
      fileBuktiPath = files.file_bukti[0].path;
    }

    const apl02 = await Apl02AsesmenMandiri.create({
      id_aplikasi,
      id_unit,
      elemen_kompetensi, 
      kriteria_unjuk_kerja,  
      jawaban,
      jenis_pengalaman,
      nama_dokumen,
      nomor_dokumen,
      tanggal_dokumen,
      file_bukti: fileBuktiPath,
      catatan_bukti
    });

    response.success(res, "Jawaban APL02 berhasil disimpan", apl02);
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return response.error(res, "File terlalu besar. Maksimal 10MB.", 400);
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return response.error(res, "File tidak valid atau terlalu banyak.", 400);
    }
    response.error(res, err.message);
  }
};

exports.getApl02Data = async (req, res) => {
  try {
    const { id_aplikasi } = req.params;

    const aplikasi = await AplikasiAsesmen.findOne({
      where: { id_aplikasi, id_user: req.user.id_user }
    });
    if (!aplikasi) {
      return response.error(res, "Aplikasi tidak ditemukan atau tidak milik Anda", 404);
    }

    const data = await Apl02AsesmenMandiri.findAll({
      where: { id_aplikasi },
      include: [
        { 
          model: UnitKompetensi, 
          attributes: ["kode_unit", "judul_unit", "elemen_kriteria"]  
        }
      ],
      order: [["created_at", "ASC"]]  
    });

    response.success(res, "Data APL02", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.updateApl02 = async (req, res) => {
  try {
    const { id_apl02 } = req.params;
    const {
      jawaban,
      jenis_pengalaman,
      nama_dokumen,
      nomor_dokumen,
      tanggal_dokumen,
      catatan_bukti
    } = req.body;

    const files = req.files;

    const apl02 = await Apl02AsesmenMandiri.findByPk(id_apl02);
    if (!apl02) {
      return response.error(res, "Data APL02 tidak ditemukan", 404);
    }

    let fileBuktiPath = apl02.file_bukti;
    if (files && files.file_bukti && files.file_bukti[0]) {
      fileBuktiPath = files.file_bukti[0].path;
    }

    await apl02.update({
      jawaban,
      jenis_pengalaman,
      nama_dokumen,
      nomor_dokumen,
      tanggal_dokumen,
      catatan_bukti,
      file_bukti: fileBuktiPath
    });

    response.success(res, "APL02 berhasil diupdate", apl02);
  } catch (err) {
    response.error(res, err.message);
  }
};
