const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
    files: 12 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("File type not allowed. Only PDF, JPG, JPEG, PNG are permitted."));
    }
  }
});

module.exports = upload.fields([
  { name: "file_dokumen", maxCount: 1 },
  { name: "file_pendukung", maxCount: 1 },
  { name: "dokumen_tambahan", maxCount: 10 },
  { name: "tanda_tangan", maxCount: 1 },
  { name: "file_bukti", maxCount: 1 },
  { name: "bukti_bayar", maxCount: 1 },
  { name: "ttd", maxCount: 1 }
]);