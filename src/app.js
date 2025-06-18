const fileUpload = require("express-fileupload");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { payment } = require("mercadopago");
const bodyParser = require("body-parser");

const clienteRouter = require("./routes/cliente.routes");
const authRouter = require("./routes/login.routes"); //
const morgan = require("morgan");
const Empleado = require("./routes/Empleados.routes");
const Producto_Better = require("./routes/productos_Better.routes");
const Catalogos = require("./routes/Catalogos.routes");
const Categoria = require("./routes/Categoria.routes");
const UneteEquipo = require("./routes/UneteEquipo.routes");
const Slider = require("./routes/Slider.routes");
const TopVendedor = require("./routes/TopVendedor.routes");
const TopReferidos = require("./routes/TopReferidos.routes");
const fileupload = require("express-fileupload");
const DetalleCarrito = require("./routes/DetalleCarrito.routes");
const Carrito = require("./routes/Carrito.routes");
const paymenRoute = require("./routes/payment.routes");
const Graduaciones = require("./routes/Graduacion.routes");
const Tratamientos = require("./routes/Tratamiento.routes");
const Pedido = require("./routes/Pedido.routes");
const DetallePedido = require("./routes/DetallesPedidos.routes");
const Logs = require("./routes/log.routes");
const Paqueteria = require("./routes/Paqueteria.routes");
const Valoracion = require("./routes/Valoraciones.routes");
const Direc_Empleado = require("./routes/Direc_Empleado.routes");
const EstadoEnvio = require("./routes/EstadoEnvio.routes");
const EstadoPedido = require("./routes/EstadoPedido.routes");
const Encuesta = require("./routes/feedback.routes");
const EncuestaM = require("./routes/feedbackMovil.routes");
const Feedback = require("./routes/FeedbackWeb.routes");

const Cita = require("./routes/Cita.routes");
const TipoCita = require("./routes/TipoCita.routes");
const EstadoCita = require("./routes/EstadoCita.routes");
const Horarios = require("./routes/Horarios.routes");
/* const Stripe = require("./routes/Metodostripe.routes")
 */ const Suscripcion = require("./routes/suscripcion.routes");

const Stripe = require("stripe");
const createPaymentIntent = require("./services/stripePayment");
const actEdoPagoCartRoutes = require("./routes/ActEdoPagoCart");
const paymentRoutes = require("./routes/PagoRoutes.rutes");
//const createPaymentIntent = require('./services/stripePayment');

const direc_ClientRouter = require("./routes/Direc_Client.routes");

app.use(fileUpload({ useTempFiles: true }));

dotenv.config();
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Configurar opciones de CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
const corsOptions = {
  origin: "*", // Permitir solicitudes desde cualquier origen
  methods: ["GET", "POST", "DELETE", "PUT", "PATH"], // Permitir solo ciertos encabezados
};

//Primero los middlewares.
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

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

const routerApi = require("./routes");
// Rutas de cliente
app.use("/clientes", clienteRouter);
app.use("/direcciones-clientes", direc_ClientRouter);
app.use("/auth", authRouter); // Usa el enrutador de autenticación en la ruta /auth
app.use("/empleados", Empleado);
app.use("/productos_better", Producto_Better);
app.use("/catalogos", Catalogos);
app.use("/categoria", Categoria);
app.use("/unete-equipo", UneteEquipo);
app.use("/slider", Slider);
app.use("/top-vendedor", TopVendedor);
app.use("/top-referidos", TopReferidos);
app.use("/DetalleCarrito", DetalleCarrito);
app.use("/Carrito", Carrito);
app.use("/stripe", Stripe);
app.use("/suscripcion", Suscripcion);
app.use("/", paymenRoute);
app.use("/", Graduaciones);
app.use("/", Tratamientos);
app.use("/pedido", Pedido);
app.use("/detallePedido", DetallePedido);
app.use("/", Logs);
app.use("/", Paqueteria);
app.use("/", Valoracion);
app.use("/", Direc_Empleado);
app.use("/", EstadoEnvio);
app.use("/", EstadoPedido);
app.use("/", Encuesta);
app.use("/", EncuestaM);
app.use("/", Feedback);

app.use("/cita", Cita);
app.use("/", TipoCita);
app.use("/", EstadoCita);
app.use("/horarios", Horarios);
app.use("/", paymentRoutes);
//app.post('/create-payment-intent', createPaymentIntent);
//app.post('/carrito', actEdoPagoCartRoutes);  // Esta es la ruta base para las peticiones a este archivo

/* app.cloudinary(); */

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Backend con NodeJS - Express + CRUD API REST + MySQL");
});

routerApi(app);

app.listen(port, () => {
  console.log("Port ==> ", port);
});
