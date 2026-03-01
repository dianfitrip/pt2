const { FrAk01, User, JadwalAsesor, Jadwal, Skema, Tuk, ProfileAsesi, ProfileAsesor, PesertaJadwal } = require("../../models");
const response = require("../../utils/response.util");
const PDFDocument = require("pdfkit");
const path = require("path");

exports.getFormData = async (req, res) => {
  try {
    const { id_peserta_jadwal } = req.params;
    const id_asesor = req.user.id_user;

    const peserta = await PesertaJadwal.findByPk(id_peserta_jadwal, {
      include: [
        { model: User, as: 'user', include: [{ model: ProfileAsesi, as: 'profileAsesi' }] },
        { model: Jadwal, as: 'jadwal', include: [{ model: Skema, as: 'skema' }, { model: Tuk, as: 'tuk' }] }
      ]
    });

    if (!peserta) return response.error(res, "Data peserta tidak ditemukan", 404);

    const tugas = await JadwalAsesor.findOne({
      where: { id_user: id_asesor, id_jadwal: peserta.id_jadwal, jenis_tugas: 'asesor_penguji' }
    });
    if (!tugas) return response.error(res, "Anda tidak ditugaskan di jadwal ini", 403);

    const profileAsesor = await ProfileAsesor.findByPk(id_asesor);

    const hariTanggal = peserta.jadwal?.tgl_awal
      ? new Date(peserta.jadwal.tgl_awal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : null;

    response.success(res, "Data form FR.AK.01", {
      id_peserta_jadwal: peserta.id_peserta,
      id_jadwal: peserta.id_jadwal,
      skema_judul: peserta.jadwal?.skema?.judul_skema,
      skema_nomor: peserta.jadwal?.skema?.kode_skema,
      skema_jenis: peserta.jadwal?.skema?.jenis_skema,
      tuk_nama: peserta.jadwal?.tuk?.nama_tuk,
      tuk_jenis: peserta.jadwal?.tuk?.jenis_tuk,
      nama_asesor: profileAsesor?.nama_lengkap,
      nama_asesi: peserta.user?.profileAsesi?.nama_lengkap,
      hari_tanggal: hariTanggal,
      waktu: peserta.jadwal?.jam,
      tempat: peserta.jadwal?.tuk?.nama_tuk,
      ttd_path_asesor: profileAsesor?.ttd_path,
      status_ttd_asesor: 'draft'
    });
  } catch (err) {
    console.error(err);
    response.error(res, err.message);
  }
};

exports.submitForm = async (req, res) => {
  try {
    const { id_peserta_jadwal } = req.params;
    const id_asesor = req.user.id_user;

    const peserta = await PesertaJadwal.findByPk(id_peserta_jadwal);
    if (!peserta) return response.error(res, "Peserta tidak ditemukan", 404);

    const tugas = await JadwalAsesor.findOne({
      where: { id_user: id_asesor, id_jadwal: peserta.id_jadwal, jenis_tugas: 'asesor_penguji' }
    });
    if (!tugas) return response.error(res, "Anda tidak ditugaskan di jadwal ini", 403);

    const {
      bukti_portfolio, bukti_reviu_produk, bukti_observasi_langsung, bukti_keg_terstruktur,
      bukti_pertanyaan_tulis, bukti_pertanyaan_lisan, bukti_pertanyaan_wawancara,
      bukti_lainnya, pernyataan_kerahasiaan
    } = req.body;

    const buktiDipilih = [bukti_portfolio, bukti_reviu_produk, bukti_observasi_langsung, bukti_keg_terstruktur, bukti_pertanyaan_tulis, bukti_pertanyaan_lisan, bukti_pertanyaan_wawancara].some(v => v == 1);
    if (!buktiDipilih) return response.error(res, "Pilih minimal 1 bukti", 400);
    if (!pernyataan_kerahasiaan) return response.error(res, "Anda harus menyetujui pernyataan kerahasiaan", 400);

    const asesor = await User.findByPk(id_asesor, { include: [{ model: ProfileAsesor, as: 'profileAsesor' }] });
    const asesi = await User.findByPk(peserta.id_user, { include: [{ model: ProfileAsesi, as: 'profileAsesi' }] });
    const jadwal = await Jadwal.findByPk(peserta.id_jadwal, { include: [{ model: Skema, as: 'skema' }, { model: Tuk, as: 'tuk' }] });

    const frAk01 = await FrAk01.create({
      id_peserta_jadwal, id_asesor,
      skema_judul: jadwal?.skema?.judul_skema, skema_nomor: jadwal?.skema?.kode_skema, skema_jenis: jadwal?.skema?.jenis_skema,
      tuk_nama: jadwal?.tuk?.nama_tuk, tuk_jenis: jadwal?.tuk?.jenis_tuk,
      nama_asesor: asesor?.profileAsesor?.nama_lengkap, nama_asesi: asesi?.profileAsesi?.nama_lengkap,
      hari_tanggal: jadwal?.tgl_awal, waktu_mulai: jadwal?.jam, tempat_pelaksanaan: jadwal?.tuk?.nama_tuk,
      bukti_portfolio: bukti_portfolio || 0, bukti_reviu_produk: bukti_reviu_produk || 0,
      bukti_observasi_langsung: bukti_observasi_langsung || 0, bukti_keg_terstruktur: bukti_keg_terstruktur || 0,
      bukti_pertanyaan_tulis: bukti_pertanyaan_tulis || 0, bukti_pertanyaan_lisan: bukti_pertanyaan_lisan || 0,
      bukti_pertanyaan_wawancara: bukti_pertanyaan_wawancara || 0, bukti_lainnya: bukti_lainnya || null,
      pernyataan_kerahasiaan: 1, status_ttd_asesor: 'draft'
    });

    response.success(res, "Form FR.AK.01 berhasil disimpan", frAk01);
  } catch (err) {
    console.error(err);
    response.error(res, err.message);
  }
};

exports.signForm = async (req, res) => {
  try {
    const { id_fr_ak_01 } = req.params;
    const id_asesor = req.user.id_user;

    const profileAsesor = await ProfileAsesor.findByPk(id_asesor);
    if (!profileAsesor || !profileAsesor.ttd_path) {
      return response.error(res, "Anda belum memiliki TTD. Silakan upload TTD di menu profil terlebih dahulu", 400);
    }

    const frAk01 = await FrAk01.findByPk(id_fr_ak_01);
    if (!frAk01) return response.error(res, "Form tidak ditemukan", 404);
    if (frAk01.id_asesor !== id_asesor) return response.error(res, "Anda tidak berhak menandatangani form ini", 403);

    await frAk01.update({ status_ttd_asesor: 'signed' });
    response.success(res, "Form berhasil ditandatangani", frAk01);
  } catch (err) {
    console.error(err);
    response.error(res, err.message);
  }
};

exports.downloadPdf = async (req, res) => {
  try {
    const { id_fr_ak_01 } = req.params;
    const id_asesor = req.user.id_user;

    const frAk01 = await FrAk01.findByPk(id_fr_ak_01, {
      include: [{ model: ProfileAsesor, as: 'profileAsesor' }]
    });

    if (!frAk01) return response.error(res, "Form tidak ditemukan", 404);
    if (frAk01.id_asesor !== id_asesor) return response.error(res, "Anda tidak berhak mengakses form ini", 403);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=FR.AK.01-${id_fr_ak_01}.pdf`);
    doc.pipe(res);

    doc.fontSize(14).text("FR.AK.01. FORMULIR PERSETUJUAN ASESMEN DAN KERAHASIAAN", { align: 'center' });
    doc.moveDown();

    doc.fontSize(10).text("Skema Sertifikasi (KKNI/Okupasi/Klaster)", { underline: true });
    doc.text(`Judul : ${frAk01.skema_judul || '-'}`);
    doc.text(`Nomor : ${frAk01.skema_nomor || '-'}`);
    doc.moveDown();

    doc.text("TUK", { underline: true });
    doc.text(`${frAk01.tuk_nama || '-'} (${frAk01.tuk_jenis || '-'})`);
    doc.moveDown();

    doc.text("Nama Asesor", { underline: true });
    doc.text(frAk01.nama_asesor || '-');
    doc.moveDown();

    doc.text("Nama Asesi", { underline: true });
    doc.text(frAk01.nama_asesi || '-');
    doc.moveDown();

    doc.text("Pelaksanaan asesmen disepakati pada:", { underline: true });
    doc.text(`Hari/Tanggal : ${frAk01.hari_tanggal ? new Date(frAk01.hari_tanggal).toLocaleDateString('id-ID') : '-'}`);
    doc.text(`Waktu        : ${frAk01.waktu_mulai || '-'}`);
    doc.text(`TUK          : ${frAk01.tempat_pelaksanaan || '-'}`);
    doc.moveDown();

    doc.text("Bukti yang akan dikumpulkan:", { underline: true });
    const buktiList = [
      { label: "Hasil Verifikasi Portfolio", val: frAk01.bukti_portfolio },
      { label: "Hasil Reviu Produk", val: frAk01.bukti_reviu_produk },
      { label: "Hasil Observasi Langsung", val: frAk01.bukti_observasi_langsung },
      { label: "Hasil Kegiatan Terstruktur", val: frAk01.bukti_keg_terstruktur },
      { label: "Hasil Pertanyaan Tertulis", val: frAk01.bukti_pertanyaan_tulis },
      { label: "Hasil Pertanyaan Lisan", val: frAk01.bukti_pertanyaan_lisan },
      { label: "Hasil Pertanyaan Wawancara", val: frAk01.bukti_pertanyaan_wawancara },
    ];
    buktiList.forEach(b => {
      doc.text(`${b.val ? '[X]' : '[ ]'} ${b.label}`);
    });
    if (frAk01.bukti_lainnya) doc.text(`[X] Lainnya: ${frAk01.bukti_lainnya}`);
    doc.moveDown();

    doc.text("Pernyataan Kerahasiaan:", { underline: true });
    doc.text(frAk01.pernyataan_kerahasiaan ? "[X]" : "[ ]", { continued: true });
    doc.text(" Menyatakan tidak akan membuka hasil pekerjaan yang saya peroleh karena penugasan saya sebagai Asesor dalam pekerjaan Asesmen kepada siapapun atau organisasi apapun selain kepada pihak yang berwenang sehubungan dengan kewajiban saya sebagai Asesor yang ditugaskan oleh LSP.");
    doc.moveDown(2);

    if (frAk01.status_ttd_asesor === 'signed' && frAk01.profileAsesor?.ttd_path) {
      try {
        doc.image(frAk01.profileAsesor.ttd_path, { width: 100, height: 50 });
      } catch (e) {
        doc.text("(Gambar TTD tidak tersedia)");
      }
    }
    doc.text("Tanda Tangan Asesor", { align: 'left' });

    doc.end();
  } catch (err) {
    console.error(err);
    response.error(res, err.message);
  }
};