  const express = require("express");
  const cors = require("cors");
  const helmet = require("helmet");
  const rateLimit = require("express-rate-limit");
  const { apiLimiter } = require("./middlewares/rateLimit.middleware");

  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(apiLimiter);

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });
  app.use(limiter);


  app.use("/api/auth", require("./routes/auth.routes"));
  app.use("/api/admin", require("./routes/admin.routes"));
  app.use("/api/asesi", require("./routes/asesi.routes"));
  app.use("/api/asesor", require("./routes/asesor.routes"));
  app.use("/api/tuk", require("./routes/tuk.routes"));
  app.use("/api/public", require("./routes/public.routes"));

  module.exports = app;
