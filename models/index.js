const sequelize = require('../config/config');
const Cliente = require('./cliente');
const Compra = require('./compra');

// Relaciones
Cliente.hasMany(Compra, { foreignKey: 'cliente_id', as: 'compras' });
Compra.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

module.exports = {
  sequelize,
  Cliente,
  Compra,
};
