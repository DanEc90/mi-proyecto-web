const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  identificacion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nombres: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  correo_electronico: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  habilitado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});

module.exports = Cliente;

