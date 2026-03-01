const rateLimit = require("express-rate-limit");

exports.apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100, 
  message: {
    message: "Terlalu banyak request, silakan coba lagi nanti."
  },
  standardHeaders: true,
  legacyHeaders: false
});

exports.loginLimiter = rateLimit({
  windowMs: 30 * 1000, 
  max: 20,          
  message: {
    message: "Terlalu banyak percobaan login, coba lagi dalam 30 detik."
  },
  standardHeaders: true,
  legacyHeaders: false
});

exports.publicFormLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10,
  message: {
    message: "Anda terlalu sering mengirim data, silakan tunggu sebentar."
  },
  standardHeaders: true,
  legacyHeaders: false
});