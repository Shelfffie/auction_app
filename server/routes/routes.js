const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authControllers");

router.post("/register", registerUser);

router.post("/login", (req, res) => {
  console.log("Login request received");
  loginUser(req, res);
});

module.exports = router;
