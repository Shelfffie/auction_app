const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/routes");
const verifyToken = require("./middlewares/authMiddleware");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.use("/uploads", express.static(path.join(__dirname, "storage")));

app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
