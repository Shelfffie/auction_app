require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const authRoutes = require("./routes/routes");
const path = require("path");
const app = express();
require("./models/cron/updateLotStatus");
require("./models/cron/checkPaymentStatus");

app.use(cors());
app.use(express.json());

const PORT = 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Клієнт підключився:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Клієнт ${socket.id} приєднався до кімнати ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("Клієнт відключився:", socket.id);
  });
});

app.use("/uploads", express.static(path.join(__dirname, "storage")));
app.use("/requests", express.static(path.join(__dirname, "storage/requests")));

app.use("/api", authRoutes);

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
