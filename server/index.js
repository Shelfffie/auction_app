const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("CHECK");
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
