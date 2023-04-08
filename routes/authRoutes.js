const { Router } = require('express');
const {
    loginUser,
    registerUser,
    loginAdmin,
    sendOtp,
} = require('../controllers/authController');

const authRoutes = Router();

authRoutes.post('/loginUser', loginUser);
authRoutes.post('/loginAdmin', loginAdmin);
authRoutes.post('/registerUser', registerUser);
authRoutes.post('/sendOtp', sendOtp);

module.exports = authRoutes;
