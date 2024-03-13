const Cliente = require("../db/models/cliente.model");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const CodigoRecuperacion = require("../db/models/codigo_model");
/* const moment = require('moment'); */

let correoRecuperar; // Variable para almacenar el correo electrónico a recuperar
let codigoRecuperacion; // Variable para almacenar el código de recuperación
//
async function recuperarContrasena(req, res) {
  const { vchCorreo } = req.body;

  try {
    // Verificar si el correo electrónico existe en la base de datos
    const cliente = await Cliente.findOne({ where: { vchCorreo } });

    if (!cliente) {
      // Si el correo electrónico no existe, enviar un mensaje de error
      return res.status(404).json({ message: 'El correo electrónico no está registrado' });
    }

    // Si el correo electrónico existe, almacenarlo en la variable global
    correoRecuperar = vchCorreo;

    // Enviar un mensaje de éxito
    res.status(200).json({ message: 'Correo electrónico encontrado. Se enviarán instrucciones para recuperar la contraseña.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al recuperar la contraseña" });
  }
}

async function verificarRespuesta(req, res) {
  const { vchPreguntaSecreta, vchRespuestaSecreta } = req.body;

  try {
    // Verificar si el correo electrónico y la respuesta coinciden en la base de datos
    const cliente = await Cliente.findOne({ where: { vchCorreo: correoRecuperar, vchPreguntaSecreta, vchRespuestaSecreta } });

    if (!cliente) {
      // Si la respuesta es incorrecta, enviar un mensaje de error
      return res.status(400).json({ message: 'La respuesta secreta es incorrecta' });
    }

    // Si la respuesta es correcta, enviar un mensaje de éxito
    res.status(200).json({ message: 'Respuesta secreta correcta. Puede cambiar la contraseña.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al verificar la respuesta secreta" });
  }
}

async function cambiarContraseña(req,res){
  const {vchPassword} = req.body;

  try{
    const cliente = await Cliente.findOne({where: {vchCorreo: correoRecuperar}});

    if(!cliente){
      return res.status(404).json({message: 'El cliente no existe'});
    }
    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(vchPassword, 10);
    cliente.vchPassword = hashedPassword;
    await cliente.save();
    res.status(200).json({message: 'Contraseña actualizada exitosamente'});

  }catch(error){
    res.status(500).json({ message: "Error al actualizar la contraseña"});
  }
}


async function enviarCodigo(req, res) {
  // Código para generar el código de recuperación
  codigoRecuperacion = Math.floor(100000 + Math.random() * 900000); 
  const horaExpiracion = new Date();
  horaExpiracion.setMinutes(horaExpiracion.getMinutes() + 5);

  try {
    // Código para enviar el correo electrónico con el código de recuperación
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '20210709@uthh.edu.mx', // Coloca tu dirección de correo electrónico
        pass: 'julce0101' // Coloca tu contraseña
      }
    });

    let mailOptions = {
      from: 'tu_correo@gmail.com',
      to: correoRecuperar, // Utiliza el correo almacenado en la variable global
      subject: 'Código de recuperación de contraseña',
      text: `Tu código de recuperación de contraseña es: ${codigoRecuperacion}`,
    
      html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #3498db;
              margin: 0;
              padding: 0;
              color: #fff;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
              color: #333;
              text-align: center;
            }
            p {
              color: #666;
              line-height: 1.5;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Recuperación de contraseña para Opticenter Huejutla</h1>
            <p>Su código de recuperación de contraseña es: <strong>${codigoRecuperacion}</strong></p>
            <p>Utilice este código para recuperar su contraseña en el sitio web.</p>
          </div>
        </body>
      </html>
    `
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al enviar el correo electrónico' });
      } else {
        console.log('Email sent: ' + info.response);
        console.log(codigoRecuperacion);
        try {
          await CodigoRecuperacion.create({
            Codigo: codigoRecuperacion,
            HoraExpiracion: horaExpiracion,
            Correo_electronico: correoRecuperar
          });
          return res.status(200).json({ message: 'Correo electrónico enviado con éxito' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error al insertar el código de recuperación en la base de datos' });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al enviar el correo electrónico' });
  }
}


async function verificarCodigo(req, res) {
  const { codigo } = req.body;


  try {
    // Buscar el código de recuperación en la base de datos
    const codigoRecuperacionDB = await CodigoRecuperacion.findOne({ where: { Codigo: codigo }});

    if (!codigoRecuperacionDB || codigoRecuperacionDB.Correo_electronico !== correoRecuperar) {
      // Si el código no existe o no corresponde al correo electrónico, enviar un mensaje de error
      return res.status(400).json({ message: 'El código de recuperación es incorrecto' });
    }

    // Si el código es correcto, enviar un mensaje de éxito
    res.status(200).json({ message: 'Código de recuperación correcto. Puede cambiar la contraseña.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al verificar el código de recuperación" });
  }
}


module.exports = { recuperarContrasena, verificarRespuesta,cambiarContraseña, enviarCodigo, verificarCodigo };
