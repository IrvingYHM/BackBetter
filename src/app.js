const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const clienteRouter = require('./routes/cliente.router');
const authRouter = require('./routes/login.route'); // 
const morgan = require('morgan');
const Empleado = require('./routes/Empleados.router');
const Producto = require('./routes/productos.route');
const fileupload = require('express-fileupload');
const DetalleCarrito = require('./routes/DetalleCarrito.router');
const Carrito = require('./routes/Carrito.route');
const paymenRoute = require ('./routes/payment.routes');
const Graduaciones = require ('./routes/Graduacion.routes');
const Tratamientos = require ('./routes/Tratamiento.routes');



const direc_ClientRouter = require("./routes/Direc_Client.router");

dotenv.config();
const app = express();

// Configurar opciones de CORS
const corsOptions = {
    origin: '*', // Permitir solicitudes desde cualquier origen
    methods: ['GET', 'POST'], // Permitir solo los métodos GET y POST
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


/* app.cloudinary(); */

const port = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send('Backend con NodeJS - Express + CRUD API REST + MySQL');
});


routerApi(app);

app.listen(port,()=>{
    console.log("Port ==> ", port);
});
