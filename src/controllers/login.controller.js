const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cliente = require('../db/models/cliente.model');
const Log = require('../db/models/log/log.model');
const requestIp = require('request-ip');

async function login(req, res) {
    const { vchCorreo, vchPassword } = req.body;
    try {
        // Buscar al cliente por correo electrónico en la base de datos
        const cliente = await Cliente.findOne({ where: { vchCorreo } });
        
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Verificar si el cliente está bloqueado temporalmente
        if (cliente.lockedUntil && cliente.lockedUntil > new Date()) {
            const tiempoRestante = Math.ceil((cliente.lockedUntil - new Date()) / 1000 / 60); // Convertir a minutos
            return res.status(403).json({ message: `Cuenta bloqueada. Intente de nuevo en ${tiempoRestante} minutos` });
        }

        const validPassword = await bcrypt.compare(vchPassword, cliente.vchPassword);
        
        if (!validPassword) {
            // Incrementar el contador de intentos de inicio de sesión
            cliente.intentosLogin = (cliente.intentosLogin || 0) + 1;
            await cliente.save();

            // Si se supera el máximo de intentos permitidos, bloquear la cuenta temporalmente por 5 minutos
            if (cliente.intentosLogin >= 3) {
                cliente.lockedUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
                cliente.intentosLogin = 0; // Reiniciar el contador de intentos
                await cliente.save();

                return res.status(403).json({ message: `Cuenta bloqueada. Intente de nuevo en 5 minutos` });
            }

            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Restablecer el contador de intentos de inicio de sesión al iniciar sesión exitosamente
        cliente.intentosLogin = 0;
        await cliente.save();

        // Generar un token de autenticación
        const token = jwt.sign({ 
            clienteId: cliente.intClvCliente,
            nombre: cliente.vchNomCliente,
            apellidoPaterno: cliente.vchAPaterno,
            apellidoMaterno: cliente.vchAMaterno,
            userType: 'cliente' // Agregar el userType aquí
        }, 'secreto', { expiresIn: '1h' });

        // Capturar la dirección IP completa del cliente
        const ip = requestIp.getClientIp(req);

        // Registrar el inicio de sesión en la base de datos
        await Log.create({
            ip: ip,
            url: req.originalUrl,
            codigo_estado: 200,
            fecha_hora: new Date(),
            id_cliente: cliente.intClvCliente
        });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}


module.exports = { login };
