const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cliente = require('../db/models/cliente.model');
const Log = require('../db/models/log/log.model');
const requestIp = require('request-ip');

async function login(req, res) {
    const { vchCorreo, vchPassword } = req.body;
    try {
        // Buscar al cliente por correo electrónico en la base de datos
        let cliente = await Cliente.findOne({ where: { vchCorreo } });
        
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        
        if (cliente.lockedUntil && cliente.lockedUntil > new Date()) {
            return res.status(401).json({ message: 'La cuenta está bloqueada. Intente de nuevo más tarde' });
        }

        const validPassword = await bcrypt.compare(vchPassword, cliente.vchPassword);
                // Capturar la dirección IP completa del cliente
                const ip = requestIp.getClientIp(req);
        
        if (!validPassword) {
            cliente.intentosLogin += 1;
            if (cliente.intentosLogin >= 3) {
                cliente.lockedUntil = new Date(Date.now() + 5 * 60 * 1000); // Bloquear la cuenta por 5 minutos
                await cliente.save();
                // Registrar el bloqueo de la cuenta en el log
                await Log.create({
                    ip: ip,
                    url: req.originalUrl,
                    codigo_estado: 200,
                    fecha_hora: new Date(),
                    id_cliente: cliente.intClvCliente,
                    Accion: "Bloqueo de cuenta por 3 intentos fallidos"
                });
                return res.status(401).json({ message: 'Contraseña incorrecta. La cuenta está bloqueada por 5 minutos' });
            }
            await cliente.save();
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Resetear el contador de intentos de login si la contraseña es válida
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



        // Registrar el inicio de sesión en la base de datos
        await Log.create({
            ip: ip,
            url: req.originalUrl,
            codigo_estado: 200,
            fecha_hora: new Date(),
            id_cliente: cliente.intClvCliente,
            Accion: "Inicio de sesion"
        });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}
 
module.exports = { login };
