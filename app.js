const express = require('express');
const dotenv = require('dotenv');
const { Cliente } = require('./models');
const sequelize = require('./config/config');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON, excluyendo DELETE
app.use((req, res, next) => {
  if (req.method === 'DELETE') {
    next(); // Omite el análisis del cuerpo
  } else {
    express.json()(req, res, next);
  }
});


// Ruta para crear un nuevo cliente
app.post('/clientes', async (req, res) => {
  try {
    const { identificacion, nombres, apellidos, direccion, correo_electronico, telefono } = req.body;

    if (!identificacion) {
      return res.status(400).json({ error: 'El campo de identificación es obligatorio' });
    }

    const nuevoCliente = await Cliente.create({
      identificacion,
      nombres,
      apellidos,
      direccion,
      correo_electronico,
      telefono
    });

    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para obtener todos los clientes habilitados
app.get('/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      where: {
        habilitado: true  // Solo obtener clientes habilitados
      }
    });
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para inhabilitar un cliente
app.put('/clientes/inhabilitar/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar al cliente por ID
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Verificar si el cliente tiene compras (esto depende de cómo manejes las compras en la base de datos)
    // Supongamos que hay un modelo "Compra" que tiene una relación con "Cliente"
    const compras = await Compra.findAll({ where: { clienteId: cliente.id } });

    if (compras.length > 0) {
      // Si el cliente tiene compras, inhabilitarlo
      cliente.habilitado = false;
      await cliente.save();
      return res.status(200).json({ message: 'Cliente inhabilitado exitosamente' });
    } else {
      return res.status(400).json({ error: 'El cliente no tiene compras y puede ser eliminado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para eliminar un cliente si no tiene compras
app.delete('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID fue proporcionado
    if (!id) {
      return res.status(400).json({ error: 'El ID del cliente es obligatorio' });
    }

    // Buscar el cliente
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Validar si tiene compras
    if (cliente.tiene_compras) {
      return res.status(400).json({
        error: 'No se puede eliminar el cliente porque tiene compras registradas',
      });
    }

    // Eliminar el cliente
    await cliente.destroy();
    res.status(200).json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



// Ruta inicial
app.get('/', (req, res) => {
  res.send('¡Bienvenido a SENCILLO! Hazlo todo sencillo con SENCILLO.');
});

// Sincronizar base de datos y luego iniciar el servidor
sequelize.sync({ force: false })
  .then(() => {
    console.log("Modelos sincronizados con la base de datos");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al sincronizar los modelos:", error);
  });
