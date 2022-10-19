const { Router } = require("express");
const { loginUser, registerUser } = require("../controllers/authController");

const authRoutes = Router();

authRoutes.post("/loginUser", loginUser);
authRoutes.post("/registerUser", registerUser);

module.exports = authRoutes;