const { createServer } = require("node:http");
const { Server } = require("socket.io");
require("dotenv").config();
const multer = require('multer');

const path = require("path");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");
const express = require("express");
const port = process.env.PORT;

// Crear el servidor express
const app = express();

// Crear servidor Socket.io

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Configurar los orígenes permitidos
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  // Escuchar cuando un cliente se une a una sala
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Usuario ${socket.id} se ha unido a la sala: ${room}`);
  });

  // Escuchar un evento personalizado llamado 'mensaje'
  socket.on("mensaje", (data) => {
    const room = data.room; // La sala debe venir en el mensaje
    console.log(`Mensaje recibido en sala ${room}:`, data);

    // Enviar el mensaje solo a la sala específica
    io.to(room).emit("mensaje", data);
  });

  // Evento para la desconexión del usuario
  socket.on("disconnect", () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// Configuración de multer para recibir archivos
const storage = multer.memoryStorage(); // Guardar el archivo en memoria
const upload = multer({ storage });
// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Directorio público
app.use(express.static("public"));

// Rutas
app.use("/api/user", require("./user/router"));
app.use("/api/login", require("./auth/router"));
app.use("/api/upload", require("./upload/router"));
app.use("/api/pet", require("./pet/router"));
app.use("/api/solicitud", require("./solicitud/router"));
app.use("/api/notifications", require("./notifications/router"));


server.listen(port, () => {
  console.log("Servidor Express escuchando en el puerto: " + port);
});
