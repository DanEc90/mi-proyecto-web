const sequelize = require('../config/config');
const Cliente = require('./cliente');

// Aquí se sincronizan los modelos con la base de datos
sequelize.sync().then(() => {
  console.log('Modelos sincronizados con la base de datos');
}).catch((error) => {
  console.error('Error al sincronizar los modelos:', error);
});

module.exports = { Cliente };
