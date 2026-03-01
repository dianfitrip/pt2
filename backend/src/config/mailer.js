const nodemailer = require("nodemailer");
const env = require("./env");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mailer error:", error);
  } else {
    console.log("✅ Mailer ready to send emails");
  }
});

module.exports = transporter;
