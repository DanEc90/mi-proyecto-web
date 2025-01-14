const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { Cliente, Compra } = require('./models'); // Importamos Cliente y Compra
const sequelize = require('./config/config');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Para manejar datos en formato JSON

// Servir archivos estáticos desde la carpeta 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

// Crear cliente
app.post('/clientes', async (req, res) => {
  try {
    const { identificacion, nombres, apellidos, direccion, correo_electronico, telefono } = req.body;
    const nuevoCliente = await Cliente.create({
      identificacion,
      nombres,
      apellidos,
      direccion,
      correo_electronico,
      telefono,
    });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los clientes
app.get('/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.findAll({ where: { habilitado: true } });
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cliente
app.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombres, apellidos, direccion, correo_electronico, telefono } = req.body;
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    await cliente.update({ nombres, apellidos, direccion, correo_electronico, telefono });
    res.status(200).json(cliente);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(400).json({ error: error.message });
  }
});

// Inhabilitar cliente
app.patch('/clientes/:id/inhabilitar', async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Verificar si el cliente ya está inhabilitado
    if (!cliente.habilitado) {
      return res.status(400).json({ error: 'El cliente ya está inhabilitado' });
    }

    // Inhabilitar al cliente
    cliente.habilitado = false;
    await cliente.save();

    res.status(200).json({ message: 'Cliente inhabilitado correctamente' });
  } catch (error) {
    console.error('Error al inhabilitar cliente:', error);
    res.status(500).json({ error: 'Ocurrió un error al intentar inhabilitar al cliente' });
  }
});

// Eliminar cliente si no tiene compras
app.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    const compras = await Compra.findAll({ where: { cliente_id: id } });
    if (compras.length > 0) {
      return res.status(400).json({ error: 'El cliente tiene compras y no puede ser eliminado' });
    }

    await Cliente.destroy({ where: { id } });
    res.status(200).json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Ocurrió un error al intentar eliminar al cliente' });
  }
});

// Ruta para acceder a la página principal
app.get('/', (req, res) => {
  res.send('¡Bienvenido a SENCILLO! Hazlo todo sencillo con SENCILLO.');
});

// Ruta para acceder al frontend
app.get('/frontend/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Sincronizar base de datos e iniciar servidor
sequelize.sync({ force: false })
  .then(() => {
    console.log('Modelos sincronizados con la base de datos');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar modelos:', error);
  });
