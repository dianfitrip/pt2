const { Skema, Persyaratan } = require("../../models");

exports.getAllPublic = async (req, res) => {
  try {
    const data = await Skema.findAll({
      where: { status: "aktif" },
      include: [
        {
          model: Persyaratan,
          attributes: ["id_persyaratan", "nama_persyaratan"],
          through: { attributes: [] } 
        }
      ],
      order: [["judul_skema", "ASC"]]
    });

    res.json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};