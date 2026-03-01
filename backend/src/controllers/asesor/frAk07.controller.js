const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { FrAk07, User, JadwalAsesor, Jadwal, Skema, Tuk, ProfileAsesi, ProfileAsesor, PesertaJadwal } = require("../../models");
const response = require("../../utils/response.util");

// Helper Validasi & Ambil Data
const getMainData = async (id_user, id_asesor) => {
    const peserta = await PesertaJadwal.findOne({
        where: { id_user },
        include: [{
            model: Jadwal, as: 'jadwal',
            include: [
                { model: Skema, as: 'skema' }, { model: Tuk, as: 'tuk' },
                { model: JadwalAsesor, as: 'jadwalAsesors', include: [{ model: User, as: 'user', include: [{ model: ProfileAsesor, as: 'profileAsesor' }] }] }
            ]
        }]
    });
    if (!peserta || !peserta.jadwal.jadwalAsesors.some(ja => ja.id_user === id_asesor)) return null;
    return peserta;
};

// 1. GET DATA
exports.getFormData = async (req, res) => {
    try {
        const peserta = await getMainData(req.params.id_user, req.user.id_user);
        if (!peserta) return response.error(res, "Data tidak ditemukan", 404);

        const asesi = await ProfileAsesi.findByPk(req.params.id_user);
        const form = await FrAk07.findOne({ where: { id_peserta_jadwal: peserta.id_peserta } });

        const namaAsesor = peserta.jadwal.jadwalAsesors.map(ja => {
            const p = ja.user.profileAsesor;
            return p ? `${p.gelar_depan || ''} ${p.nama_lengkap} ${p.gelar_belakang || ''}`.trim() : '';
        }).join('; ');

        response.success(res, "OK", {
            id_peserta_jadwal: peserta.id_peserta,
            header: {
                skema_sertifikasi: peserta.jadwal.skema?.judul_skema,
                tuk: peserta.jadwal.tuk?.nama_tuk,
                nama_asesi: asesi?.nama_lengkap,
                nama_asesor: namaAsesor,
                tanggal: form?.tanggal || new Date().toISOString().split('T')[0]
            },
            data: form
        });
    } catch (err) { response.error(res, err.message); }
};

// 2. SUBMIT
exports.submitForm = async (req, res) => {
    try {
        const peserta = await getMainData(req.params.id_user, req.user.id_user);
        if (!peserta) return response.error(res, "Akses ditolak", 403);

        // Ambil TTD dari profil asesor yang login
        const profileAsesor = await ProfileAsesor.findByPk(req.user.id_user);
        
        const toJson = (v) => (typeof v === 'string' ? v : JSON.stringify(v));

        const payload = {
            id_peserta_jadwal: peserta.id_peserta,
            id_asesor: req.user.id_user,
            tanggal: req.body.tanggal || new Date(),
            panduan_jenis: req.body.panduan_jenis,
            a1_penyesuaian: req.body.a1_penyesuaian, a1_keterangan: toJson(req.body.a1_keterangan),
            a2_penyesuaian: req.body.a2_penyesuaian, a2_keterangan: toJson(req.body.a2_keterangan),
            a3_penyesuaian: req.body.a3_penyesuaian, a3_keterangan: toJson(req.body.a3_keterangan),
            a4_penyesuaian: req.body.a4_penyesuaian, a4_keterangan: toJson(req.body.a4_keterangan),
            a5_penyesuaian: req.body.a5_penyesuaian, a5_keterangan: toJson(req.body.a5_keterangan),
            a6_penyesuaian: req.body.a6_penyesuaian, a6_keterangan: toJson(req.body.a6_keterangan),
            a7_penyesuaian: req.body.a7_penyesuaian, a7_keterangan: toJson(req.body.a7_keterangan),
            a8_penyesuaian: req.body.a8_penyesuaian, a8_keterangan: toJson(req.body.a8_keterangan),
            b1_sesuai: req.body.b1_sesuai, b1_keputusan: req.body.b1_keputusan,
            b2_sesuai: req.body.b2_sesuai, b2_keputusan: req.body.b2_keputusan,
            b3_sesuai: req.body.b3_sesuai, b3_keputusan: req.body.b3_keputusan,
            hasil_penyesuaian_karakteristik: req.body.hasil_penyesuaian_karakteristik,
            hasil_penyesuaian_rencana: req.body.hasil_penyesuaian_rencana,
            ttd_asesor_path: profileAsesor.ttd_path // Otomatis dari profil asesor
        };

        const existing = await FrAk07.findOne({ where: { id_peserta_jadwal: peserta.id_peserta } });
        if (existing) await FrAk07.update(payload, { where: { id_fr_ak_07: existing.id_fr_ak_07 } });
        else await FrAk07.create(payload);

        response.success(res, "Form berhasil disimpan");
    } catch (err) { response.error(res, err.message); }
};

// 3. DOWNLOAD PDF
exports.downloadPdf = async (req, res) => {
    try {
        const peserta = await getMainData(req.params.id_user, req.user.id_user);
        if (!peserta) return response.error(res, "Akses ditolak", 403);

        const form = await FrAk07.findOne({ where: { id_peserta_jadwal: peserta.id_peserta } });
        if (!form) return response.error(res, "Formulir belum diisi", 404);

        const asesi = await ProfileAsesi.findByPk(req.params.id_user);
        
        // Ambil Semua Asesor di Jadwal ini
        const allAsesors = await JadwalAsesor.findAll({
            where: { id_jadwal: peserta.jadwal.id_jadwal },
            include: [{ model: User, as: 'user', include: [{ model: ProfileAsesor, as: 'profileAsesor' }] }]
        });

        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=FR-AK-07-${peserta.id_peserta}.pdf`);
        doc.pipe(res);

        // Header
        doc.fontSize(12).text('FR.AK.07 CEKLIS PENYESUAIAN YANG WAJAR DAN BERALASAN', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(9).text(`Skema: ${peserta.jadwal.skema.judul_skema}`);
        doc.text(`TUK: ${peserta.jadwal.tuk.nama_tuk}`);
        doc.text(`Nama Asesi: ${asesi.nama_lengkap}`);
        doc.text(`Tanggal: ${new Date(form.tanggal).toLocaleDateString('id-ID')}`);
        doc.moveDown();

        // Panduan
        doc.fontSize(10).text(`Panduan: ${form.panduan_jenis}`, { underline: true });
        
        // Bagian A
        const renderA = (num, val, ket) => doc.text(`${num}. ${val === 'Ya' ? 'Ya' : 'Tidak'}: ${val === 'Ya' ? (JSON.parse(ket || '[]').join(', ')) : ''}`);
        renderA('A.1', form.a1_penyesuaian, form.a1_keterangan);
        renderA('A.2', form.a2_penyesuaian, form.a2_keterangan);
        renderA('A.3', form.a3_penyesuaian, form.a3_keterangan);
        renderA('A.4', form.a4_penyesuaian, form.a4_keterangan);
        renderA('A.5', form.a5_penyesuaian, form.a5_keterangan);
        renderA('A.6', form.a6_penyesuaian, form.a6_keterangan);
        renderA('A.7', form.a7_penyesuaian, form.a7_keterangan);
        renderA('A.8', form.a8_penyesuaian, form.a8_keterangan);

        // Bagian B
        doc.moveDown().text(`B.1 (Acuan): ${form.b1_sesuai} ${form.b1_keputusan ? '- ' + form.b1_keputusan : ''}`);
        doc.text(`B.2 (Potensi): ${form.b2_sesuai} ${form.b2_keputusan ? '- ' + form.b2_keputusan : ''}`);
        doc.text(`B.3 (Konteks): ${form.b3_sesuai} ${form.b3_keputusan ? '- ' + form.b3_keputusan : ''}`);

        // Hasil
        doc.moveDown().text(`Hasil Karakteristik: ${form.hasil_penyesuaian_karakteristik || '-'}`);
        doc.text(`Hasil Rencana: ${form.hasil_penyesuaian_rencana || '-'}`);

        // TTD Semua Asesor di Jadwal
        doc.moveDown(2).text('Tanda Tangan Asesor', { align: 'center' });
        doc.moveDown();
        let x = 50;
        
        for (const ja of allAsesors) {
            const p = ja.user.profileAsesor;
            if (p?.ttd_path) {
                const pth = path.join(__dirname, "../../../", p.ttd_path);
                if (fs.existsSync(pth)) {
                    doc.image(pth, x, doc.y, { width: 80 });
                    doc.text(`${p.gelar_depan||''} ${p.nama_lengkap} ${p.gelar_belakang||''}`, x, doc.y + 50, { width: 80, align: 'center' });
                    x += 120;
                    if(x > 400) { doc.moveDown(3); x = 50; }
                }
            }
        }
        doc.end();
    } catch (err) { response.error(res, err.message); }
};