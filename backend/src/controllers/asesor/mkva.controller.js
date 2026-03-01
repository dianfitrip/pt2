const { Mkva, JadwalAsesor, Jadwal, Skema, Tuk, User, PesertaJadwal } = require("../../models");
const response = require("../../utils/response.util");
const PDFDocument = require('pdfkit');

const fmt = (val) => val ? JSON.parse(val).join(', ') : '-';

const periodeLabel = (val) => ({
  'sebelum_asesmen': 'Sebelum Asesmen',
  'pada_saat_asesmen': 'Pada Saat Asesmen', 
  'setelah_asesmen': 'Setelah Asesmen'
}[val] || val);

const options = {
  periode: [
    { value: 'sebelum_asesmen', label: 'Sebelum Asesmen' },
    { value: 'pada_saat_asesmen', label: 'Pada Saat Asesmen' },
    { value: 'setelah_asesmen', label: 'Setelah Asesmen' }
  ],
  tujuan_fokus_validasi: ['Bagian dari proses penjaminan mutu organisasi', 'Mengantisipasi risiko', 'Memenuhi persyaratan BNSP', 'Memastikan kesesuaian bukti-bukti', 'Meningkatkan kualitas asesmen', 'Mengevaluasi kualitas perangkat asesmen'],
  konteks_validasi: ['Internal organisasi', 'Eksternal organisasi', 'Proses lisensi/re lisensi', 'Dengan kolega asesor', 'Kolega dari organisasi pelatihan atau asesmen'],
  pendekatan_validasi: ['Panel asesmen', 'Pertemuan moderasi', 'Mengkaji perangkat asesmen', 'Acuan pembanding', 'Pengujian lapangan dan uji coba perangkat asesmen', 'Umpan balik dari klien'],
  acuan_pembanding: ['Standar Kompetensi', 'SOP/IK', 'Manual Instruction/book', 'Standar Kinerja'],
  dokumen_terkait: ['Skema sertifikasi', 'SKKNI/SK3/SKI', 'Perangkat asesmen', 'Peraturan/Pedoman'],
  keterampilan_komunikasi: ['PRO AKTIF', 'ACTIVE LISTENING'],
  aturan_bukti: [
    { value: 'V', label: 'Valid (Sahih)' }, { value: 'A', label: 'Authentic (Asli)' },
    { value: 'T', label: 'Current (Terkini)' }, { value: 'M', label: 'Sufficient (Memadai)' }
  ],
  prinsip_asesmen: [
    { value: 'V', label: 'Valid' }, { value: 'R', label: 'Reliable (Dapat Dipercaya)' },
    { value: 'F', label: 'Fair (Adil)' }, { value: 'F', label: 'Flexible (Fleksibel)' }
  ]
};

exports.getJadwalAsesor = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const jadwalAsesors = await JadwalAsesor.findAll({
      where: { id_user, jenis_tugas: 'validator_mkva' },
      include: [{ model: Jadwal, as: 'jadwal', include: [{ model: Skema, as: 'skema' }, { model: Tuk, as: 'tuk' }] }]
    });
    
    if (!jadwalAsesors.length) return response.success(res, "Tidak ada jadwal MKVA", []);
    
    const jadwalList = await Promise.all(jadwalAsesors.map(async (ja) => {
      const j = ja.jadwal;
      const count = await PesertaJadwal.count({ where: { id_jadwal: j.id_jadwal } });
      return {
        id_jadwal: j.id_jadwal,
        nama_kegiatan: `Jadwal ${j.periode_bulan} ${j.tahun}`,
        tanggal: `${new Date(j.tgl_awal).toLocaleDateString('id-ID')} Pukul: ${j.jam || 'N/A'}`,
        tempat: j.tuk?.nama_tuk || 'N/A',
        skema: `${j.skema?.judul_skema} (${j.skema?.kode_skema})`,
        peserta_terjadwal: `${count} Asesi`,
        actions: count > 0 ? ['input_mkva', 'download_surat_tugas'] : []
      };
    }));
    
    response.success(res, "Daftar jadwal MKVA", jadwalList);
  } catch (err) { response.error(res, err.message); }
};

exports.getFormData = async (req, res) => {
  try {
    const { id_jadwal } = req.params;
    const id_user = req.user.id_user;
    
    const jadwalAsesor = await JadwalAsesor.findOne({
      where: { id_jadwal, id_user, jenis_tugas: 'validator_mkva' },
      include: [{ model: Jadwal, as: 'jadwal', include: [{ model: Skema, as: 'skema' }, { model: Tuk, as: 'tuk' }] }]
    });
    
    if (!jadwalAsesor) return response.error(res, "Jadwal MKVA tidak ditemukan", 403);
    
    const timValidasi = await JadwalAsesor.findAll({
      where: { id_jadwal, jenis_tugas: 'validator_mkva' },
      include: [{ model: User, as: 'user', attributes: ['nama_lengkap'] }]
    });
    
    const timNames = timValidasi.map(j => j.user?.nama_lengkap).filter(Boolean).join(', ');
    
    response.success(res, "Data form MKVA", {
      id_jadwal,
      tim_validasi: timNames || "Tim dari TUK",
      hari_tgl: jadwalAsesor.jadwal.tgl_awal,
      tempat: jadwalAsesor.jadwal.tuk?.nama_tuk,
      nama_skema: jadwalAsesor.jadwal.skema?.judul_skema,
      nomor_skema: jadwalAsesor.jadwal.skema?.kode_skema,
      ...options
    });
  } catch (err) { response.error(res, err.message); }
};

exports.submitForm = async (req, res) => {
  try {
    const { id_jadwal } = req.params;
    const id_user = req.user.id_user;
    
    const exists = await JadwalAsesor.findOne({ where: { id_jadwal, id_user, jenis_tugas: 'validator_mkva' } });
    if (!exists) return response.error(res, "Tidak diizinkan", 403);
    
    const { asesor_kompetensi, ...fields } = req.body;
    
    if (!asesor_kompetensi || !Array.isArray(asesor_kompetensi) || asesor_kompetensi.length === 0) {
      return response.error(res, "Asesor kompetensi wajib diisi", 400);
    }
    
    const data = {
      id_jadwal, id_user, jenis_tugas: 'validator_mkva',
      periode: fields.periode,
      asesor_kompetensi: JSON.stringify(asesor_kompetensi),
      lead_asesor: fields.lead_asesor ? JSON.stringify(fields.lead_asesor) : null,
      manajer_supervisor: fields.manajer_supervisor ? JSON.stringify(fields.manajer_supervisor) : null,
      tenaga_ahli: fields.tenaga_ahli ? JSON.stringify(fields.tenaga_ahli) : null,
      koord_pelatihan: fields.koord_pelatihan ? JSON.stringify(fields.koord_pelatihan) : null,
      anggota_asosiasi: fields.anggota_asosiasi ? JSON.stringify(fields.anggota_asosiasi) : null,
      hasil_konfirmasi: fields.hasil_konfirmasi,
      kontribusi_hasil_asesmen: fields.kontribusi_hasil_asesmen,
      ...Object.fromEntries(
        Object.entries(fields).filter(([k]) => !['asesor_kompetensi', 'lead_asesor', 'manajer_supervisor', 'tenaga_ahli', 'koord_pelatihan', 'anggota_asosiasi', 'hasil_konfirmasi', 'kontribusi_hasil_asesmen', 'periode'].includes(k))
        .map(([k, v]) => [k, JSON.stringify(v)])
      )
    };
    
    const mkva = await Mkva.create(data);
    response.success(res, "Form MKVA berhasil disimpan", mkva);
  } catch (err) { response.error(res, err.message); }
};

exports.downloadForm = async (req, res) => {
  try {
    const { id_mkva } = req.params;
    const id_user = req.user.id_user;
    
    const mkva = await Mkva.findOne({
      where: { id_mkva },
      include: [{ model: JadwalAsesor, as: 'jadwalAsesor', where: { id_user },
        include: [{ model: Jadwal, as: 'jadwal', include: [{ model: Skema, as: 'skema' }, { model: Tuk, as: 'tuk' }] }]
      }]
    });
    
    if (!mkva) return response.error(res, "Form tidak ditemukan", 404);
    
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="MKVA_${id_mkva}.pdf"`);
    doc.pipe(res);
    
    const j = mkva.jadwalAsesor?.jadwal;
    doc.fontSize(16).text('FORM MONITORING KUALITAS VALIDASI ASESMEN (MKVA)', { align: 'center' });
    doc.moveDown();
    doc.fontSize(11).text(`Skema: ${j?.skema?.judul_skema} (${j?.skema?.kode_skema})`);
    doc.text(`Tanggal: ${new Date(j?.tgl_awal).toLocaleDateString('id-ID')} | Tempat: ${j?.tuk?.nama_tuk}`);
    doc.moveDown();
    doc.text(`Periode: ${periodeLabel(mkva.periode)}`);
    doc.text(`Tujuan Fokus: ${fmt(mkva.tujuan_fokus_validasi)}`);
    doc.text(`Konteks: ${fmt(mkva.konteks_validasi)}`);
    doc.text(`Pendekatan: ${fmt(mkva.pendekatan_validasi)}`);
    doc.moveDown();
    doc.text(`Asesor Kompetensi: ${fmt(mkva.asesor_kompetensi)}`);
    if (mkva.lead_asesor) doc.text(`Lead Asesor: ${fmt(mkva.lead_asesor)}`);
    if (mkva.manajer_supervisor) doc.text(`Manajer/Supervisor: ${fmt(mkva.manajer_supervisor)}`);
    if (mkva.tenaga_ahli) doc.text(`Tenaga Ahli: ${fmt(mkva.tenaga_ahli)}`);
    if (mkva.koord_pelatihan) doc.text(`Koord. Pelatihan: ${fmt(mkva.koord_pelatihan)}`);
    if (mkva.anggota_asosiasi) doc.text(`Anggota Asosiasi: ${fmt(mkva.anggota_asosiasi)}`);
    doc.moveDown();
    doc.text(`Acuan Pembanding: ${fmt(mkva.acuan_pembanding)}`);
    doc.text(`Dokumen Terkait: ${fmt(mkva.dokumen_terkait)}`);
    doc.text(`Keterampilan Komunikasi: ${fmt(mkva.keterampilan_komunikasi)}`);
    doc.moveDown();
    doc.text(`Proses Asesmen: ${fmt(mkva.proses_asesmen)}`);
    doc.text(`Rencana Asesmen: ${fmt(mkva.rencana_asesmen)}`);
    doc.text(`Interpretasi Standar Kompetensi: ${fmt(mkva.interpretasi_standar_kompetensi)}`);
    doc.text(`Interpretasi Acuan Pembanding Lainnya: ${fmt(mkva.interpretasi_acuan_pembanding_lainnya)}`);
    doc.text(`Penyeleksian Metode Asesmen: ${fmt(mkva.penyeleksian_metode_asesmen)}`);
    doc.text(`Penyeleksian Perangkat Asesmen: ${fmt(mkva.penyeleksian_perangkat_asesmen)}`);
    doc.text(`Bukti-bukti Dikumpulkan: ${fmt(mkva.bukti_bukti_dikumpulkan)}`);
    doc.text(`Proses Pengambilan Keputusan: ${fmt(mkva.proses_pengambilan_keputusan)}`);
    doc.moveDown();
    doc.text(`Kontribusi Hasil Asesmen: ${mkva.kontribusi_hasil_asesmen || '-'}`);
    doc.text(`Temuan Rekomendasi: ${fmt(mkva.temuan_rekomendasi)}`);
    doc.text(`Rencana Implementasi: ${fmt(mkva.rencana_implementasi)}`);
    doc.end();
  } catch (err) { response.error(res, err.message); }
};

exports.downloadSuratTugas = async (req, res) => {
  try {
    const { id_jadwal } = req.params;
    const id_user = req.user.id_user;
    
    const jadwalAsesor = await JadwalAsesor.findOne({
      where: { id_jadwal, id_user, jenis_tugas: 'validator_mkva' },
      include: [{ model: Jadwal, as: 'jadwal', include: [{ model: Skema, as: 'skema' }, { model: Tuk, as: 'tuk' }] }, { model: User, as: 'user', attributes: ['nama_lengkap'] }]
    });
    
    if (!jadwalAsesor) return response.error(res, "Jadwal tidak ditemukan", 403);
    
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Surat_Tugas_MKVA_${id_jadwal}.pdf"`);
    doc.pipe(res);
    
    doc.fontSize(16).text('SURAT TUGAS MKVA', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Kepada: ${jadwalAsesor.user.nama_lengkap}`);
    doc.text(`Jadwal: ${jadwalAsesor.jadwal.nama_kegiatan}`);
    doc.text(`Tanggal: ${new Date(jadwalAsesor.jadwal.tgl_awal).toLocaleDateString('id-ID')}`);
    doc.text(`Tempat: ${jadwalAsesor.jadwal.tuk?.nama_tuk}`);
    doc.text(`Skema: ${jadwalAsesor.jadwal.skema?.judul_skema}`);
    doc.end();
  } catch (err) { response.error(res, err.message); }
};