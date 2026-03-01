const {FrAk02, User, JadwalAsesor, Jadwal, Skema, ProfileAsesi, ProfileAsesor,UnitKompetensi, SkemaUnit, PesertaJadwal} = require("../../models");
const response = require("../../utils/response.util");
const PDFDocument = require('pdfkit');

exports.getFormData = async (req, res) => {
  try {
    const { id_user } = req.params;
    const id_user_asesor = req.user.id_user;

    const jadwalAsesor = await JadwalAsesor.findOne({
      where: { id_user: id_user_asesor, jenis_tugas: 'asesor_penguji' },
      include: [{ model: Jadwal, as: 'jadwal' }]
    });

    if (!jadwalAsesor) return response.error(res, "Jadwal tidak ditemukan", 403);

    const asesi = await User.findOne({
      where: { id_user },
      include: [{ model: ProfileAsesi, as: 'profileAsesi' }]
    });

    const allAsesors = await JadwalAsesor.findAll({
      where: { id_jadwal: jadwalAsesor.id_jadwal, jenis_tugas: 'asesor_penguji' },
      include: [{ model: User, as: 'asesor', include: [{ model: ProfileAsesor, as: 'profileAsesor' }] }]
    });

    const namaAsesorList = allAsesors.map(ja => ja.asesor?.profileAsesor?.nama_lengkap || ja.asesor?.username).join('; ');

    const ttdAsesors = allAsesors.map(ja => ({
      id_user: ja.asesor?.id_user,
      nama: ja.asesor?.profileAsesor?.nama_lengkap || ja.asesor?.username,
      ttd_path: ja.asesor?.profileAsesor?.ttd_path
    }));

    const skema = await Skema.findByPk(jadwalAsesor.jadwal?.id_skema);
    const skemaUnits = await SkemaUnit.findAll({
      where: { id_skema: skema?.id_skema },
      include: [{ model: UnitKompetensi, as: 'unit', attributes: ['kode_unit', 'judul_unit'] }],
      order: [['urutan', 'ASC']]
    });

    const unitKompetensi = skemaUnits.map(su => ({
      kode_unit: su.unit?.kode_unit,
      judul_unit: su.unit?.judul_unit,
      ceklis: { observasi_demonstrasi: false, portofolio: false, pernyataan_pihak_ketiga: false, pertanyaan_wawancara: false, pertanyaan_lisan: false, pertanyaan_tertulis: false, proyek_kerja: false },
      hasil_asesmen: null
    }));

    response.success(res, "Data form FR-AK-02", {
      id_user_asesi: asesi.id_user,
      nama_asesi: asesi.profileAsesi?.nama_lengkap || asesi.username,
      nik_asesi: asesi.profileAsesi?.nik,
      ttd_path_asesi: asesi.profileAsesi?.ttd_path,
      nama_asesor: namaAsesorList,
      ttd_asesors: ttdAsesors,
      skema_sertifikasi: skema?.judul_skema,
      kode_skema: skema?.kode_skema,
      tanggal_mulai: jadwalAsesor.jadwal?.tgl_awal,
      tanggal_selesai: jadwalAsesor.jadwal?.tgl_akhir,
      unit_kompetensi: unitKompetensi,
      id_jadwal: jadwalAsesor.id_jadwal,
      id_skema: skema?.id_skema
    });
  } catch (err) {
    console.error(err);
    response.error(res, err.message);
  }
};

exports.submitForm = async (req, res) => {
  try {
    const { id_user: id_user_asesi } = req.params;
    const id_user_asesor = req.user.id_user;
    const { id_peserta, id_jadwal, id_skema, nama_asesi, nama_asesor, skema_sertifikasi, tanggal_mulai, tanggal_selesai, unit_kompetensi, rekomendasi_hasil, tindak_lanjut, komentar_asesor, ttd_asesor_confirmed, id_fr_ak_02 } = req.body;

    const jadwalAsesor = await JadwalAsesor.findOne({ where: { id_user: id_user_asesor, id_jadwal, jenis_tugas: 'asesor_penguji' } });
    if (!jadwalAsesor) return response.error(res, "Anda tidak memiliki akses", 403);

    const pesertaJadwal = await PesertaJadwal.findOne({ where: { id_jadwal, id_user: id_user_asesi } });
    if (!pesertaJadwal) return response.error(res, "Peserta tidak ditemukan", 404);

    const data = {
      id_peserta: pesertaJadwal.id_peserta,
      id_jadwal, id_skema, id_user_asesor, nama_asesi, nama_asesor, skema_sertifikasi, tanggal_mulai, tanggal_selesai,
      unit_kompetensi,
      rekomendasi_hasil,
      tindak_lanjut: tindak_lanjut || null,
      komentar_asesor: komentar_asesor || null,
      ttd_asesor_confirmed: ttd_asesor_confirmed || false,
      ttd_asesor_confirmed_at: ttd_asesor_confirmed ? new Date() : null
    };

    if (id_fr_ak_02) {
      await FrAk02.update(data, { where: { id_fr_ak_02 } });
      response.success(res, "Berhasil diperbarui", await FrAk02.findByPk(id_fr_ak_02));
    } else {
      response.success(res, "Berhasil disimpan", await FrAk02.create(data));
    }
  } catch (err) {
    console.error(err);
    response.error(res, err.message);
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { id_fr_ak_02 } = req.params;
    const id_user_asesor = req.user.id_user;
    const { unit_kompetensi, rekomendasi_hasil, tindak_lanjut, komentar_asesor, ttd_asesor_confirmed } = req.body;

    const frAk02 = await FrAk02.findByPk(id_fr_ak_02);
    if (!frAk02) return response.error(res, "Data tidak ditemukan", 404);

    const jadwalAsesor = await JadwalAsesor.findOne({ where: { id_user: id_user_asesor, id_jadwal: frAk02.id_jadwal, jenis_tugas: 'asesor_penguji' } });
    if (!jadwalAsesor) return response.error(res, "Anda tidak memiliki akses", 403);

    await frAk02.update({
      unit_kompetensi,
      rekomendasi_hasil,
      tindak_lanjut: tindak_lanjut || null,
      komentar_asesor: komentar_asesor || null,
      ttd_asesor_confirmed: ttd_asesor_confirmed || false,
      ttd_asesor_confirmed_at: ttd_asesor_confirmed ? new Date() : frAk02.ttd_asesor_confirmed_at,
      updated_at: new Date()
    });

    response.success(res, "Berhasil diperbarui", frAk02);
  } catch (err) {
    console.error(err);
    response.error(res, err.message);
  }
};

exports.downloadPdf = async (req, res) => {
  try {
    const { id_fr_ak_02 } = req.params;

    const frAk02 = await FrAk02.findByPk(id_fr_ak_02, {
      include: [
        { model: Skema, as: 'skema' },
        { model: PesertaJadwal, as: 'peserta', include: [{ model: User, as: 'user', include: [{ model: ProfileAsesi, as: 'profileAsesi' }] }] }
      ]
    });

    if (!frAk02) return response.error(res, "Data tidak ditemukan", 404);

    const allAsesors = await JadwalAsesor.findAll({
      where: { id_jadwal: frAk02.id_jadwal, jenis_tugas: 'asesor_penguji' },
      include: [{ model: User, as: 'asesor', include: [{ model: ProfileAsesor, as: 'profileAsesor' }] }]
    });

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="FR-AK-02-${frAk02.nama_asesi}.pdf"`);
    doc.pipe(res);
    doc.fontSize(14).text('FORMULIR REKAMAN ASESMEN KOMPETENSI (FR.AK.02)', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Nama Asesi : ${frAk02.nama_asesi}`);
    doc.text(`NIK        : ${frAk02.peserta?.user?.profileAsesi?.nik || '-'}`);
    doc.text(`Alamat     : ${frAk02.peserta?.user?.profileAsesi?.alamat || '-'}`);
    doc.moveDown();
    doc.text(`Nama Asesor : ${frAk02.nama_asesor}`);
    doc.moveDown();
    doc.text(`Skema   : ${frAk02.skema_sertifikasi}`);
    doc.text(`Tanggal : ${frAk02.tanggal_mulai ? new Date(frAk02.tanggal_mulai).toLocaleDateString('id-ID') : '-'} s/d ${frAk02.tanggal_selesai ? new Date(frAk02.tanggal_selesai).toLocaleDateString('id-ID') : '-'}`);
    doc.moveDown(2);
    doc.fontSize(9).text('Kode Unit', 40, doc.y, { continued: true });
    doc.text('Judul Unit', 120, doc.y - 9, { continued: true });
    doc.text('OD', 350, doc.y - 18, { continued: true });
    doc.text('PF', 380, doc.y - 27, { continued: true });
    doc.text('P3', 410, doc.y - 36, { continued: true });
    doc.text('W', 440, doc.y - 45, { continued: true });
    doc.text('Lis', 470, doc.y - 54, { continued: true });
    doc.text('Tul', 500, doc.y - 63, { continued: true });
    doc.text('Proy', 530, doc.y - 72, { continued: true });
    doc.text('Hasil', 570, doc.y - 81);
    doc.moveDown();

    frAk02.unit_kompetensi.forEach((unit, i) => {
      const y = doc.y;
      doc.fontSize(8).text(unit.kode_unit || '-', 40, y, { width: 70 });
      doc.text(unit.judul_unit || '-', 120, y, { width: 210 });
      doc.text(unit.ceklis?.observasi_demonstrasi ? '✓' : '-', 350, y);
      doc.text(unit.ceklis?.portofolio ? '✓' : '-', 380, y);
      doc.text(unit.ceklis?.pernyataan_pihak_ketiga ? '✓' : '-', 410, y);
      doc.text(unit.ceklis?.pertanyaan_wawancara ? '✓' : '-', 440, y);
      doc.text(unit.ceklis?.pertanyaan_lisan ? '✓' : '-', 470, y);
      doc.text(unit.ceklis?.pertanyaan_tertulis ? '✓' : '-', 500, y);
      doc.text(unit.ceklis?.proyek_kerja ? '✓' : '-', 530, y);
      doc.text(unit.hasil_asesmen || '-', 570, y);
      doc.moveDown();
    });

    doc.moveDown();
    doc.fontSize(10).text(`Rekomendasi : ${frAk02.rekomendasi_hasil?.toUpperCase()}`);
    doc.text(`Tindak Lanjut : ${frAk02.tindak_lanjut || '-'}`);
    doc.text(`Komentar : ${frAk02.komentar_asesor || '-'}`);
    doc.moveDown(2);
    doc.text('Tanda Tangan Asesi:', { underline: true });
    doc.moveDown();
    if (frAk02.peserta?.user?.profileAsesi?.ttd_path) {
      doc.image(frAk02.peserta.user.profileAsesi.ttd_path, 40, doc.y, { width: 100, height: 50 });
    }
    doc.moveDown(7);
    doc.text('Tanda Tangan Asesor:', { underline: true });
    doc.moveDown();
    for (const ja of allAsesors) {
      const ttdPath = ja.asesor?.profileAsesor?.ttd_path;
      if (ttdPath) {
        doc.image(ttdPath, 40, doc.y, { width: 100, height: 50 });
      }
      doc.text(ja.asesor?.profileAsesor?.nama_lengkap || ja.asesor?.username, 150, doc.y - 30);
      doc.moveDown(6);
    }

    doc.end();
  } catch (err) {
    console.error(err);
    response.error(res, err.message);
  }
};