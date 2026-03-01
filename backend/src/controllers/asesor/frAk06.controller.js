const { FrAk06, JadwalAsesor, Jadwal, Skema, Tuk, ProfileAsesor } = require("../../models");
const response = require("../../utils/response.util");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.getFormData = async (req, res) => {
  try {
    const { id_jadwal } = req.params;
    const id_user = req.user.id_user;

    const jadwalAsesor = await JadwalAsesor.findOne({
      where: { id_jadwal, id_user, jenis_tugas: 'asesor_penguji' },
      include: [
        { model: Jadwal, as: 'jadwal', include: [{ model: Skema }, { model: Tuk }] },
        { model: ProfileAsesor, as: 'profileAsesor' },
      ],
    });

    if (!jadwalAsesor) return response.error(res, "Jadwal tidak ditemukan", 403);

    const profileAsesor = await ProfileAsesor.findOne({ where: { id_user } });
    const existingAk06 = await Ak06.findOne({ where: { id_jadwal, id_user } });

    response.success(res, "Data form AK-06", {
      skema: jadwalAsesor.jadwal.skema,
      tuk: jadwalAsesor.jadwal.tuk,
      asesor: {
        id: id_user,
        nama_lengkap: jadwalAsesor.profileAsesor?.nama_lengkap,
        ttd_path: profileAsesor?.ttd_path,
      },
      tanggal: jadwalAsesor.jadwal.tgl_awal,
      existingData: existingAk06,
    });
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.submitForm = async (req, res) => {
  try {
    const { id_jadwal } = req.params;
    const id_user = req.user.id_user;
    const data = req.body;

    const jadwalAsesor = await JadwalAsesor.findOne({
      where: { id_jadwal, id_user, jenis_tugas: 'asesor_penguji' },
    });
    if (!jadwalAsesor) return response.error(res, "Tidak diizinkan", 403);

    const [ak06, created] = await Ak06.upsert({ id_jadwal, id_user, ...data });
    response.success(res, created ? "Form AK-06 disimpan" : "Form AK-06 diperbarui", ak06);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { id_jadwal } = req.params;
    const id_user = req.user.id_user;
    const data = req.body;

    const jadwalAsesor = await JadwalAsesor.findOne({
      where: { id_jadwal, id_user, jenis_tugas: 'asesor_penguji' },
    });
    if (!jadwalAsesor) return response.error(res, "Tidak diizinkan", 403);

    const ak06 = await Ak06.findOne({ where: { id_jadwal, id_user } });
    if (!ak06) return response.error(res, "Data tidak ditemukan", 404);

    await ak06.update(data);
    response.success(res, "Form AK-06 diperbarui", ak06);
  } catch (err) {
    response.error(res, err.message);
  }
};

exports.downloadForm = async (req, res) => {
  try {
    const { id_jadwal } = req.params;
    const id_user = req.user.id_user;
    const jadwalAsesor = await JadwalAsesor.findOne({
      where: { id_jadwal, id_user, jenis_tugas: 'asesor_penguji' },
    });
    if (!jadwalAsesor) return response.error(res, "Tidak diizinkan", 403);

    const jadwal = await Jadwal.findByPk(id_jadwal, {
      include: [{ model: Skema, as: 'skema' }, { model: Tuk, as: 'tuk' }],
    });

    const semuaAsesor = await JadwalAsesor.findAll({
      where: { id_jadwal, jenis_tugas: 'asesor_penguji' },
      include: [{ model: ProfileAsesor, as: 'profileAsesor' }],
    });

    const semuaAk06 = await Ak06.findAll({ where: { id_jadwal } });

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="FR.AK.06_${id_jadwal}.pdf"`);
    doc.pipe(res);
    doc.fontSize(14).text('FR.AK.06. MENINJAU PROSES ASESMEN', { align: 'center' });
    doc.moveDown();
    doc.fontSize(9);
    doc.text(`Skema Sertifikasi (${jadwal.skema.jenis_skema})`);
    doc.text(`Judul  : ${jadwal.skema.judul_skema}`);
    doc.text(`Nomor  : ${jadwal.skema.kode_skema}`);
    doc.text(`TUK    : ${jadwal.tuk.jenis_tuk}`);
    doc.text(`Tanggal: ${new Date(jadwal.tgl_awal).toLocaleDateString('id-ID')}`);
    doc.moveDown();
    doc.fontSize(10).text('ASPEK YANG DITINJAU', { bold: true });
    doc.moveDown(0.5);

    for (const asesor of semuaAsesor) {
      const ak06 = semuaAk06.find(a => a.id_user === asesor.id_user);
      const profile = asesor.profileAsesor;

      doc.fontSize(9).text(`Asesor: ${profile?.nama_lengkap || '-'}`, { bold: true });
      doc.moveDown(0.2);

      const getAspek = (v, r, f, a) => {
        const arr = [];
        if (v) arr.push('Validitas');
        if (r) arr.push('Reliabel');
        if (f) arr.push('Fleksibel');
        if (a) arr.push('Adil');
        return arr.join(', ') || '-';
      };

      if (ak06) {
        doc.text(`Rencana Asesmen       : ${getAspek(ak06.rencana_validitas, ak06.rencana_reliabel, ak06.rencana_fleksibel, ak06.rencana_adil)}`);
        doc.text(`Persiapan Asesmen     : ${getAspek(ak06.persiapan_validitas, ak06.persiapan_reliabel, ak06.persiapan_fleksibel, ak06.persiapan_adil)}`);
        doc.text(`Implementasi Asesmen  : ${getAspek(ak06.implementasi_validitas, ak06.implementasi_reliabel, ak06.implementasi_fleksibel, ak06.implementasi_adil)}`);
        doc.text(`Keputusan Asesmen     : ${getAspek(ak06.keputusan_validitas, ak06.keputusan_reliabel, ak06.keputusan_fleksibel, ak06.keputusan_adil)}`);
        doc.text(`Umpan Balik Asesmen   : ${getAspek(ak06.umpan_balik_validitas, ak06.umpan_balik_reliabel, ak06.umpan_balik_fleksibel, ak06.umpan_balik_adil)}`);
        doc.moveDown(0.3);

        doc.text(`Rekomendasi untuk peningkatan: ${ak06.rekomendasi_peningkatan1 || '-'}`);
        doc.moveDown(0.3);

        const kons = [];
        if (ak06.konsistensi_task_skills) kons.push('Task Skills');
        if (ak06.konsistensi_task_management_skills) kons.push('Task Management Skills');
        if (ak06.konsistensi_contingency_management_skills) kons.push('Contingency Management Skills');
        if (ak06.konsistensi_job_role_environment_skills) kons.push('Job Role/Environment Skills');
        if (ak06.konsistensi_transfer_skills) kons.push('Transfer Skills');

        doc.text(`Konsistensi keputusan asesmen: ${kons.join(', ') || '-'}`);
        doc.text(`  Task Skills: ${ak06.detail_konsistensi_task_skills || '-'}`);
        doc.text(`  Task Management Skills: ${ak06.detail_konsistensi_task_management_skills || '-'}`);
        doc.text(`  Contingency Management Skills: ${ak06.detail_konsistensi_contingency_management_skills || '-'}`);
        doc.text(`  Job Role/Environment Skills: ${ak06.detail_konsistensi_job_role_environment_skills || '-'}`);
        doc.text(`  Transfer Skills: ${ak06.detail_konsistensi_transfer_skills || '-'}`);
        doc.moveDown(0.3);

        doc.text(`Rekomendasi untuk peningkatan: ${ak06.rekomendasi_peningkatan2 || '-'}`);
        doc.text(`Komentar: ${ak06.komentar || '-'}`);
        doc.moveDown(0.3);
        if (ak06.ttd_path) {
          const ttdPath = path.join(__dirname, '../../../', ak06.ttd_path);
          if (fs.existsSync(ttdPath)) {
            doc.text('TTD: ');
            doc.image(ttdPath, { fit: [80, 40] });
          }
        }
      } else {
        doc.text('(Belum mengisi form)');
      }

      doc.moveDown();
    }

    doc.end();
  } catch (err) {
    console.error(err);
    response.error(res, err.message);
  }
};