const { FrAk05, JadwalAsesor, Jadwal, Skema, PesertaJadwal, User, Tuk, SkemaUnit, ProfileAsesor, ProfileAsesi, UnitKompetensi } = require("../../models");
const response = require("../../utils/response.util");
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

exports.getFormData = async (req, res) => {
  try {
    const { id_jadwal_asesor } = req.params;
    const id_user = req.user.id_user;

    const jadwalAsesor = await JadwalAsesor.findOne({
      where: { id_jadwal: id_jadwal_asesor, id_user, jenis_tugas: 'asesor_penguji' },
      include: [{ model: Jadwal, as: 'jadwal', include: [
        { model: Skema, as: 'skema', include: [{ model: SkemaUnit, as: 'skemaUnits', include: [{ model: UnitKompetensi, as: 'unitKompetensi' }], order: [['urutan', 'ASC']] }] },
        { model: Tuk, as: 'tuk' }
      ]}]
    });

    if (!jadwalAsesor) return response.error(res, "Tidak diizinkan", 403);

    const allAsesors = await JadwalAsesor.findAll({
      where: { id_jadwal: id_jadwal_asesor, jenis_tugas: 'asesor_penguji' },
      include: [{ model: User, as: 'user', include: [{ model: ProfileAsesor, as: 'profileAsesor' }] }]
    });

    const peserta = await PesertaJadwal.findAll({
      where: { id_jadwal: id_jadwal_asesor },
      include: [{ model: User, as: 'user', include: [{ model: ProfileAsesi, as: 'profileAsesi' }] }]
    });

    const { skema, tuk } = jadwalAsesor.jadwal;
    const myProfile = await ProfileAsesor.findOne({ where: { id_user } });

    response.success(res, "Data form FR.AK.05", {
      skema: { kode: skema.kode_skema, judul: skema.judul_skema, jenis: skema.jenis_skema },
      tuk: { nama: tuk.nama_tuk, jenis: tuk.jenis_tuk },
      asesor: allAsesors.map(a => ({ id_user: a.user.id_user, nama: `${a.user.gelar_depan || ''} ${a.user.nama_lengkap} ${a.user.gelar_belakang || ''}`.trim(), ttd_path: a.user.profileAsesor?.ttd_path })),
      my_ttd_path: myProfile?.ttd_path || null,
      unit_kompetensi: skema.skemaUnits.map(su => ({ id_unit: su.unitKompetensi.id_unit, kode: su.unitKompetensi.kode_unit, judul: su.unitKompetensi.judul_unit })),
      peserta: peserta.map(p => ({ id_peserta: p.id_peserta, id_user: p.user.id_user, nama: p.user.nama_lengkap || p.user.username, nik: p.user.profileAsesi?.nik }))
    });
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.submitForm = async (req, res) => {
  try {
    const { id_jadwal_asesor } = req.params;
    const id_user = req.user.id_user;
    const { id_peserta, rekomendasi_unit, aspek_positif, aspek_negatif, penolakan_hasil, saran_perbaikan, catatan, ttd_saya } = req.body;

    const jadwalAsesor = await JadwalAsesor.findOne({ where: { id_jadwal: id_jadwal_asesor, id_user, jenis_tugas: 'asesor_penguji' } });
    if (!jadwalAsesor) return response.error(res, "Tidak diizinkan", 403);

    const jadwal = await Jadwal.findByPk(id_jadwal_asesor, { include: [{ model: Skema, as: 'skema' }, { model: Tuk, as: 'tuk' }] });
    const peserta = await PesertaJadwal.findByPk(id_peserta, { include: [{ model: User, as: 'user' }] });
    const asesi = await User.findByPk(peserta.id_user, { include: [{ model: ProfileAsesi, as: 'profileAsesi' }] });
    const asesor = await User.findByPk(id_user, { include: [{ model: ProfileAsesor, as: 'profileAsesor' }] });

    const myProfile = await ProfileAsesor.findOne({ where: { id_user } });
    const ttd_asesor_path = (ttd_saya && myProfile?.ttd_path) ? myProfile.ttd_path : null;

    const frAk05 = await FrAk05.create({
      id_peserta, id_jadwal: id_jadwal_asesor, id_skema: jadwal.id_skema, id_tuk: jadwal.id_tuk, id_asesor: id_user, id_asesi: peserta.id_user,
      kode_skema: jadwal.skema.kode_skema, judul_skema: jadwal.skema.judul_skema, jenis_skema: jadwal.skema.jenis_skema,
      nama_tuk: jadwal.tuk.nama_tuk, jenis_tuk: jadwal.tuk.jenis_tuk,
      nama_asesor: `${asesor.gelar_depan || ''} ${asesor.nama_lengkap} ${asesor.gelar_belakang || ''}`.trim(),
      no_reg_asesor: asesor.profileAsesor?.no_reg_asesor || '',
      nama_asesi: asesi.nama_lengkap, nik_asesi: asesi.profileAsesi?.nik,
      rekomendasi_unit: JSON.stringify(rekomendasi_unit),
      aspek_positif, aspek_negatif, penolakan_hasil, saran_perbaikan, catatan, ttd_asesor_path
    });

    response.success(res, "Form FR.AK.05 berhasil disimpan", frAk05);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.getMyForm = async (req, res) => {
  try {
    const { id_jadwal_asesor, id_peserta } = req.params;
    const id_user = req.user.id_user;

    if (req.method === 'PUT') {
      const { rekomendasi_unit, aspek_positif, aspek_negatif, penolakan_hasil, saran_perbaikan, catatan, ttd_saya } = req.body;

      const jadwalAsesor = await JadwalAsesor.findOne({ where: { id_jadwal: id_jadwal_asesor, id_user, jenis_tugas: 'asesor_penguji' } });
      if (!jadwalAsesor) return response.error(res, "Tidak diizinkan", 403);

      const frAk05 = await FrAk05.findOne({ where: { id_jadwal: id_jadwal_asesor, id_peserta, id_asesor: id_user } });
      if (!frAk05) return response.error(res, "Form FR.AK.05 tidak ditemukan", 404);

      const myProfile = await ProfileAsesor.findOne({ where: { id_user } });
      const ttd_asesor_path = (ttd_saya && myProfile?.ttd_path) ? myProfile.ttd_path : frAk05.ttd_asesor_path;

      await frAk05.update({
        rekomendasi_unit: JSON.stringify(rekomendasi_unit),
        aspek_positif, aspek_negatif, penolakan_hasil, saran_perbaikan, catatan, ttd_asesor_path
      });

      return response.success(res, "Form FR.AK.05 berhasil diperbarui", frAk05);
    }

    const frAk05 = await FrAk05.findOne({ where: { id_jadwal: id_jadwal_asesor, id_peserta, id_asesor: id_user } });
    if (!frAk05) return response.error(res, "Form FR.AK.05 tidak ditemukan", 404);

    const data = { ...frAk05.toJSON(), rekomendasi_unit: typeof frAk05.rekomendasi_unit === 'string' ? JSON.parse(frAk05.rekomendasi_unit) : frAk05.rekomendasi_unit };
    response.success(res, "Data FR.AK.05", data);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.downloadForm = async (req, res) => {
  try {
    const { id_jadwal_asesor, id_peserta } = req.params;
    const id_user = req.user.id_user;

    const frAk05 = await FrAk05.findOne({ where: { id_jadwal: id_jadwal_asesor, id_peserta, id_asesor: id_user } });
    if (!frAk05) return response.error(res, "Form FR.AK.05 tidak ditemukan", 404);

    const allAsesors = await JadwalAsesor.findAll({
      where: { id_jadwal: id_jadwal_asesor, jenis_tugas: 'asesor_penguji' },
      include: [{ model: User, as: 'user', include: [{ model: ProfileAsesor, as: 'profileAsesor' }] }]
    });

    const rekomendasiUnit = typeof frAk05.rekomendasi_unit === 'string' ? JSON.parse(frAk05.rekomendasi_unit) : frAk05.rekomendasi_unit;

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="FR.AK.05_${id_jadwal_asesor}_${id_peserta}.pdf"`);
    doc.pipe(res);

    doc.fontSize(16).font('Helvetica-Bold').text('FR.AK.05. LAPORAN ASESMEN', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold').text(`Skema Sertifikasi (${frAk05.jenis_skema}):`);
    doc.font('Helvetica').text(`Judul: ${frAk05.judul_skema}\nNomor: ${frAk05.kode_skema}`);
    doc.moveDown();
    doc.font('Helvetica-Bold').text(`TUK: ${frAk05.nama_tuk} (${frAk05.jenis_tuk})`);
    doc.moveDown();
    doc.font('Helvetica-Bold').text('Nama Asesor:');
    allAsesors.forEach((a, i) => doc.font('Helvetica').text(`${i + 1}. ${a.user.gelar_depan || ''} ${a.user.nama_lengkap} ${a.user.gelar_belakang || ''}`.trim()));
    doc.moveDown();
    doc.font('Helvetica-Bold').text(`Nama Asesi: ${frAk05.nama_asesi}\nNIK: ${frAk05.nik_asesi || '-'}`);
    doc.moveDown();
    doc.font('Helvetica-Bold').text('Unit Kompetensi:');
    rekomendasiUnit.forEach((u, i) => doc.font('Helvetica').text(`${i + 1}. ${u.kode_unit} - ${u.judul_unit} : ${u.rekomendasi}`));
    doc.moveDown();
    doc.font('Helvetica-Bold').text('Aspek Positif:').font('Helvetica').text(frAk05.aspek_positif || '-');
    doc.moveDown();
    doc.font('Helvetica-Bold').text('Aspek Negatif:').font('Helvetica').text(frAk05.aspek_negatif || '-');
    doc.moveDown();
    doc.font('Helvetica-Bold').text('Pencatatan Penolakan:').font('Helvetica').text(frAk05.penolakan_hasil || '-');
    doc.moveDown();
    doc.font('Helvetica-Bold').text('Saran Perbaikan:').font('Helvetica').text(frAk05.saran_perbaikan || '-');
    doc.moveDown();
    doc.font('Helvetica-Bold').text('Catatan:').font('Helvetica').text(frAk05.catatan || '-');
    doc.moveDown(2);
    doc.font('Helvetica-Bold').text('Tanda Tangan Asesor:');
    
    for (const a of allAsesors) {
      if (a.user.profileAsesor?.ttd_path) {
        const ttdPath = path.join(__dirname, '../../..', a.user.profileAsesor.ttd_path);
        if (fs.existsSync(ttdPath)) {
          doc.font('Helvetica').text(`${a.user.gelar_depan || ''} ${a.user.nama_lengkap} ${a.user.gelar_belakang || ''}`.trim());
          doc.image(ttdPath, { width: 150, height: 50 });
        }
      }
    }

    doc.end();
  } catch (err) {
    response.error(res, err.message);
  }
};