const transporter = require("../config/mailer");

exports.sendAccountEmail = async (email, username, password) => {
  await transporter.sendMail({
    from: `"Sistem LSP" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Akun Sistem LSP",
    html: `
      <h3>Akun Anda</h3>
      <p>Username: <b>${username}</b></p>
      <p>Password: <b>${password}</b></p>
      <p>Silakan login dan segera ganti password.</p>
    `
  });
};