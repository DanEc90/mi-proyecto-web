// URL de tu API backend
const API_URL = 'http://localhost:3000/clientes';

// Función para crear un cliente
document.getElementById('createClientForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Recoger los valores del formulario
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const identificacion = document.getElementById('identificacion').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const correo_electronico = document.getElementById('correo_electronico').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombres,
                apellidos,
                identificacion,
                telefono,
                direccion,
                correo_electronico,
            }),
        });

        const data = await response.json();

        if (response.status === 201) {
            alert('Cliente creado correctamente');
            loadClients(); // Recargar la lista de clientes después de crear uno
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error al crear el cliente:', error);
        alert('Ocurrió un error al crear el cliente');
    }
});

// Función para cargar los clientes desde la API
async function loadClients() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const tableBody = document.getElementById('clientsTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos

        data.forEach(client => {
            const row = tableBody.insertRow();

            // Convertir fecha de registro a horario local
            const localDate = new Date(client.fecha_registro).toLocaleString("es-EC", {
                timeZone: "America/Guayaquil",
            });

            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.nombres}</td>
                <td>${client.apellidos}</td>
                <td>${client.identificacion}</td>
                <td>${client.telefono}</td>
                <td>${client.direccion}</td>
                <td>${client.correo_electronico}</td>
                <td>${localDate}</td>
                <td>${client.habilitado ? 'Sí' : 'No'}</td>
                <td>
                    <button onclick="disableClient(${client.id})">Inhabilitar</button>
                    <button onclick="deleteClient(${client.id})">Eliminar</button>
                </td>
            `;
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        alert('Ocurrió un error al cargar los clientes');
    }
}

// Función para inhabilitar un cliente
async function disableClient(clientId) {
    try {
        const response = await fetch(`${API_URL}/${clientId}/inhabilitar`, {
            method: 'PATCH',
        });

        const data = await response.json();

        if (response.status === 200) {
            alert('Cliente inhabilitado correctamente');
            loadClients(); // Recargar la lista de clientes
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error al inhabilitar cliente:', error);
        alert('Ocurrió un error al intentar inhabilitar al cliente');
    }
}

// Función para eliminar un cliente
async function deleteClient(clientId) {
    try {
        const response = await fetch(`${API_URL}/${clientId}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (response.status === 200) {
            alert('Cliente eliminado correctamente');
            loadClients(); // Recargar la lista de clientes
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        alert('Ocurrió un error al intentar eliminar al cliente');
    }
}

// Cargar los clientes al inicio
loadClients();

