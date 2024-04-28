const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const clienteRouter = require('./routes/cliente.routes');
const authRouter = require('./routes/login.routes'); // 
const morgan = require('morgan');
const Empleado = require('./routes/Empleados.routes');
const Producto = require('./routes/productos.routes');
const fileupload = require('express-fileupload');
const DetalleCarrito = require('./routes/DetalleCarrito.routes');
const Carrito = require('./routes/Carrito.routes');
const paymenRoute = require ('./routes/payment.routes');
const Graduaciones = require ('./routes/Graduacion.routes');
const Tratamientos = require ('./routes/Tratamiento.routes');
const Pedido = require ('./routes/Pedido.routes');
const DetallePedido = require ('./routes/DetallesPedidos.routes');
const Logs = require ('./routes/log.routes');
const Paqueteria = require ('./routes/Paqueteria.routes');
const Valoracion = require('./routes/Valoraciones.routes');
const Direc_Empleado = require('./routes/Direc_Empleado.routes');
const EstadoEnvio = require('./routes/EstadoEnvio.routes')
const EstadoPedido  = require('./routes/EstadoPedido.routes')
const Cita = require('./routes/Cita.routes');
const TipoCita = require('./routes/TipoCita.routes');
const EstadoCita = require('./routes/EstadoCita.routes');








const direc_ClientRouter = require("./routes/Direc_Client.routes");

dotenv.config();
const app = express();

// Configurar opciones de CORS
const corsOptions = {
    origin: '*', // Permitir solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATH'], // Permitir solo los métodos GET y POST
    allowedHeaders: ['Content-Type', 'Authorization'], // Permitir solo ciertos encabezados
  };

//Primero los middlewares.
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(fileupload({
  useTempFiles: true,
  tempFileDir: './uploads'
}));

/* const Productos = require('./db/models/producto.model'); */
/* const Cliente = require('./db/models/cliente.model');
const Carritos = require('./db/models/Carrito.model');
const DetalleCarritos = require('./db/models/DetalleCarrito.model');
 */


// Eliminar la tabla de Productos
/* Cliente.drop()
  .then(() => {
    console.log('Tabla de productos eliminada correctamente');
  })
  .catch((error) => {
    console.error('Error al eliminar la tabla de productos:', error);
  });

  Carritos.drop()
  .then(() => {
    console.log('Tabla de productos eliminada correctamente');
  })
  .catch((error) => {
    console.error('Error al eliminar la tabla de productos:', error);
  });
  DetalleCarritos.drop()
  .then(() => {
    console.log('Tabla de productos eliminada correctamente');
  })
  .catch((error) => {
    console.error('Error al eliminar la tabla de productos:', error);
  }); */


const routerApi = require('./routes');
// Rutas de cliente
app.use('/clientes', clienteRouter);
app.use("/direcciones-clientes", direc_ClientRouter);
app.use('/auth', authRouter); // Usa el enrutador de autenticación en la ruta /auth
app.use('/empleados', Empleado);
app.use('/productos', Producto)
app.use('/DetalleCarrito', DetalleCarrito)
app.use('/Carrito', Carrito)
app.use('/',paymenRoute);
app.use('/',Graduaciones);
app.use('/',Tratamientos);
app.use('/',Pedido);
app.use('/',DetallePedido);
app.use('/',Logs);
app.use('/',Paqueteria);
app.use('/',Valoracion);
app.use('/', Direc_Empleado);
app.use("/", EstadoEnvio);
app.use("/", EstadoPedido);
app.use("/", Cita);
app.use("/", TipoCita);
app.use("/", EstadoCita);











/* app.cloudinary(); */

const port = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send('Backend con NodeJS - Express + CRUD API REST + MySQL');
});


routerApi(app);

app.listen(port,()=>{
    console.log("Port ==> ", port);
});
