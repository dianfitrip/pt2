const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Role = sequelize.define("roles", {
  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_name: {
    type: DataTypes.STRING(30),
    unique: true
  }
}, {
  tableName: "roles",
  timestamps: false
});

module.exports = Role;
