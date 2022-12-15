const { Router } = require("express");
const { loginUser, registerUser, loginAdmin } = require("../controllers/authController");

const authRoutes = Router();

authRoutes.post("/loginUser", loginUser);
authRoutes.post("/loginAdmin", loginAdmin);
authRoutes.post("/registerUser", registerUser);

module.exports = authRoutes;