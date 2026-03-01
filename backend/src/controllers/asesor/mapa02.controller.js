const { JadwalAsesor, Jadwal, Skema, Mapa, Mapa02Mapping, Mapa02Metode, ProfileAsesor, UnitKompetensi, KelompokPekerjaan } = require("../../models");
const Mapa02Peserta = require("../../models/mapa02_peserta.model"); 
const response = require("../../utils/response.util");
const PDFDocument = require('pdfkit');

// --- 1. GET DATA (TAMPILAN) ---
exports.getFormData = async (req, res) => {
    try {
        const { id_peserta } = req.query;
        const jadwalAsesor = await JadwalAsesor.findOne({
            where: { id_user: req.user.id_user, jenis_tugas: 'asesor_penguji' },
            include: [{ model: Jadwal, as: 'jadwal', include: [{ model: Skema, as: 'skema' }] }]
        });
        if (!jadwalAsesor) return response.error(res, "Jadwal tidak ditemukan", 403);

        const id_skema = jadwalAsesor.jadwal.id_skema;
        const id_jadwal = jadwalAsesor.jadwal.id_jadwal;

        // Ambil ID MAPA versi 2023
        const mapa = await Mapa.findOne({ where: { id_skema, versi: '2023', jenis: 'MAPA-02' } });
        if (!mapa) return response.error(res, "MAPA-02 Versi 2023 belum tersedia", 404);

        // Ambil Struktur Mapping (Unit & Kelompok)
        const mappings = await Mapa02Mapping.findAll({
            where: { id_mapa: mapa.id_mapa },
            include: [
                { model: UnitKompetensi, attributes: ['kode_unit', 'judul_unit'] },
                { model: KelompokPekerjaan, attributes: ['nama_kelompok'] }
            ],
            order: [['id_mapping', 'ASC']]
        });

        // Ambil Metode Available (dari Admin)
        const idMappings = mappings.map(m => m.id_mapping);
        const metodeOptions = await Mapa02Metode.findAll({
            where: { id_mapping: idMappings, digunakan: true }
        });

        // Ambil Nilai Peserta (Jika id_peserta dipilih)
        let nilaiPeserta = [];
        if (id_peserta) {
            nilaiPeserta = await Mapa02Peserta.findAll({
                where: { id_peserta, id_mapa: mapa.id_mapa }
            });
        }

        // Ambil Penyusun & Validator
        const allAsesor = await JadwalAsesor.findAll({ where: { id_jadwal }, include: [{ model: ProfileAsesor, as: 'profileAsesor' }] });
        const penyusun = allAsesor.find(a => a.jenis_tugas === 'asesor_penguji')?.profileAsesor?.nama_lengkap;
        const validator = allAsesor.find(a => a.jenis_tugas === 'validator')?.profileAsesor?.nama_lengkap;

        // Format Response
        const kelompokMap = {};
        mappings.forEach(m => {
            const kpName = m.KelompokPekerjaan ? m.KelompokPekerjaan.nama_kelompok : 'Umum';
            if (!kelompokMap[kpName]) kelompokMap[kpName] = [];

            const metodeList = metodeOptions
                .filter(mt => mt.id_mapping === m.id_mapping)
                .map(mt => {
                    const input = nilaiPeserta.find(p => p.id_mapping === m.id_mapping && p.metode === mt.metode);
                    return { metode: mt.metode, nilai: input ? input.nilai : null };
                });

            kelompokMap[kpName].push({
                id_mapping: m.id_mapping,
                kode_unit: m.UnitKompetensi.kode_unit,
                judul_unit: m.UnitKompetensi.judul_unit,
                metode: metodeList
            });
        });

        response.success(res, "Data FR.MAPA.02", {
            id_mapa: mapa.id_mapa,
            id_jadwal,
            skema: { judul: jadwalAsesor.jadwal.skema.judul_skema, kode: jadwalAsesor.jadwal.skema.kode_skema },
            kelompok_pekerjaan: kelompokMap,
            penyusun_dan_validator: { penyusun, validator }
        });
    } catch (err) { response.error(res, err.message); }
};

// --- 2. SUBMIT (POST) ---
exports.submitForm = async (req, res) => {
    try {
        const { id_peserta, id_mapa, data_unit } = req.body; // data_unit = [{id_mapping, metode, nilai}, ...]
        
        for (const item of data_unit) {
            const { id_mapping, metode, nilai } = item;
            if (!id_mapping || !metode || !nilai) continue;

            const [data, created] = await Mapa02Peserta.findOrCreate({
                where: { id_peserta, id_mapping, metode },
                defaults: { id_mapa, nilai }
            });
            if (!created) await data.update({ nilai });
        }
        response.success(res, "Data berhasil disimpan");
    } catch (err) { response.error(res, err.message); }
};

// --- 3. UPDATE (PUT) ---
exports.updateScore = async (req, res) => {
    try {
        const { id_peserta, id_mapping, metode, nilai, id_mapa } = req.body;
        if (!id_peserta || !id_mapping || !metode || !nilai || nilai < 1 || nilai > 4) {
            return response.error(res, "Data tidak valid", 400);
        }

        const [data, created] = await Mapa02Peserta.findOrCreate({
            where: { id_peserta, id_mapping, metode },
            defaults: { id_mapa, nilai }
        });
        if (!created) await data.update({ nilai });
        response.success(res, "Nilai diperbarui");
    } catch (err) { response.error(res, err.message); }
};

// --- 4. DOWNLOAD PDF ---
exports.downloadPDF = async (req, res) => {
    try {
        const { id_jadwal, id_peserta } = req.query;
        const jadwalAsesor = await JadwalAsesor.findOne({ where: { id_user: req.user.id_user, id_jadwal, jenis_tugas: 'asesor_penguji' } });
        if (!jadwalAsesor) return response.error(res, "Akses ditolak", 403);

        const jadwal = await Jadwal.findByPk(id_jadwal, { include: [{ model: Skema, as: 'skema' }] });
        const mapa = await Mapa.findOne({ where: { id_skema: jadwal.id_skema, versi: '2023', jenis: 'MAPA-02' } });
        
        const mappings = await Mapa02Mapping.findAll({
            where: { id_mapa: mapa.id_mapa },
            include: [{ model: UnitKompetensi }, { model: KelompokPekerjaan }]
        });
        
        const metodeOptions = await Mapa02Metode.findAll({ where: { id_mapping: mappings.map(m => m.id_mapping), digunakan: true } });
        const nilaiPeserta = await Mapa02Peserta.findAll({ where: { id_peserta, id_mapa: mapa.id_mapa } });

        const allAsesor = await JadwalAsesor.findAll({ where: { id_jadwal }, include: [{ model: ProfileAsesor, as: 'profileAsesor' }] });
        const penyusun = allAsesor.find(a => a.jenis_tugas === 'asesor_penguji')?.profileAsesor?.nama_lengkap || '-';
        const validator = allAsesor.find(a => a.jenis_tugas === 'validator')?.profileAsesor?.nama_lengkap || '-';

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=FR.MAPA.02.pdf`);
        doc.pipe(res);

        doc.fontSize(14).text('FR.MAPA.02 PETA INSTRUMEN ASESMEN', { align: 'center' }).moveDown();
        doc.fontSize(10).text(`Skema : ${jadwal.skema.judul_skema} (${jadwal.skema.kode_skema}) | Versi : 2023`).moveDown();

        mappings.forEach(m => {
            const kpName = m.KelompokPekerjaan ? m.KelompokPekerjaan.nama_kelompok : 'Umum';
            doc.fontSize(11).text(`Kelompok Pekerjaan : ${kpName}`, { underline: true });
            doc.fontSize(10).text(`Unit : ${m.UnitKompetensi.kode_unit} - ${m.UnitKompetensi.judul_unit}`);
            
            const metodeList = metodeOptions.filter(mt => mt.id_mapping === m.id_mapping);
            metodeList.forEach(mt => {
                const val = nilaiPeserta.find(p => p.id_mapping === m.id_mapping && p.metode === mt.metode)?.nilai || '-';
                doc.text(`   ${mt.metode} : ${val}`, { indent: 20 });
            });
            doc.moveDown();
        });

        doc.moveDown(2).fontSize(10).text(`Penyusun : ${penyusun}`, 50).text(`Validator : ${validator}`, 300);
        doc.end();
    } catch (err) { response.error(res, err.message); }
};