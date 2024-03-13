const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const clienteRouter = require('./routes/cliente.router');
const authRouter = require('./routes/login.route'); // Importa el enrutador de autenticación

const Empleado = require('./routes/Empleados.router');
const Producto = require('./routes/productos.route');

dotenv.config();
const app = express();

// Configurar opciones de CORS
const corsOptions = {
    origin: '*', // Permitir solicitudes desde cualquier origen
    methods: ['GET', 'POST'], // Permitir solo los métodos GET y POST
    allowedHeaders: ['Content-Type', 'Authorization'], // Permitir solo ciertos encabezados
  };

//Primero los middlewares.
app.use(cors(corsOptions));
app.use(express.json());

const routerApi = require('./routes');
// Rutas de cliente
app.use('/clientes', clienteRouter);
app.use('/auth', authRouter); // Usa el enrutador de autenticación en la ruta /auth
app.use('/empleados', Empleado);
app.use('/productos', Producto)


const port = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send('Backend con NodeJS - Express + CRUD API REST + MySQL');
});



routerApi(app);

app.listen(port,()=>{
    console.log("Port ==> ", port);
});
