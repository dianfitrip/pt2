const { Surveillance, User, Skema } = require("../../models");
const { Op } = require("sequelize");
const response = require("../../utils/response.util");
const ExcelJS = require("exceljs");

const getAllSurveillance = async (req, res) => {
  try {
    const {
      search,
      periode,
      id_skema,
      status_verifikasi,
      sumber_dana
    } = req.query;

    const where = {};

    if (periode) where.periode_surveillance = periode;
    if (id_skema) where.id_skema = id_skema;
    if (status_verifikasi) where.status_verifikasi = status_verifikasi;
    if (sumber_dana) where.sumber_dana = sumber_dana;

    const data = await Surveillance.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id_user", "username", "email"]
        },
        {
          model: Skema,
          attributes: ["id_skema", "judul_skema"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    return response.success(res, "Data surveillance", data);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const updateStatusSurveillance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_verifikasi } = req.body;

    const allowed = ["submitted", "review", "valid", "tidak_valid"];

    if (!allowed.includes(status_verifikasi)) {
      return response.error(res, "Status tidak valid", 400);
    }

    const data = await Surveillance.findByPk(id);

    if (!data) {
      return response.error(res, "Data surveillance tidak ditemukan", 404);
    }

    await data.update({ status_verifikasi });

    return response.success(res, "Status berhasil diupdate", data);
  } catch (err) {
    console.error("UPDATE STATUS SURVEILLANCE ERROR:", err);
    return response.error(res, err.message);
  }
};

const exportSurveillance = async (req, res) => {
  try {
    const data = await Surveillance.findAll();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Surveillance");

    sheet.columns = [
      { header: "User ID", key: "id_user" },
      { header: "Skema ID", key: "id_skema" },
      { header: "Periode", key: "periode_surveillance" },
      { header: "Sumber Dana", key: "sumber_dana" },
      { header: "Status", key: "status_verifikasi" }
    ];

    data.forEach(item => {
      sheet.addRow(item.toJSON());
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=surveillance.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getAllSurveillance,
  updateStatusSurveillance,
  exportSurveillance
};