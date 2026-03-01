const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".xlsx" && ext !== ".xls") {
    return cb(new Error("File harus Excel (.xlsx / .xls)"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;