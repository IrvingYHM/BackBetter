const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cliente = require('../db/models/cliente.model');


async function login(req, res) {
    const { vchCorreo, vchPassword } = req.body;
    try {
        // Buscar al cliente por correo electrónico en la base de datos
        const cliente = await Cliente.findOne({ where: { vchCorreo } });
        
        // Si no se encuentra el cliente, enviar un mensaje de error
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        
        // Verificar la contraseña
        const validPassword = await bcrypt.compare(vchPassword, cliente.vchPassword);
        
        // Si la contraseña no es válida, enviar un mensaje de error
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }        
        // Generar un token de autenticación
        const token = jwt.sign({ clienteId: cliente.intClvCliente }, 'secreto', { expiresIn: '1h' });
        
        // Enviar el token como respuesta
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}

module.exports = { login };
