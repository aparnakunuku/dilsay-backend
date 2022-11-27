const { body, validationResult } = require("express-validator");
const { createToken } = require("../middlewares/verifyToken");
const userModel = require("../models/userModel");

module.exports.loginUser = [
  
    body("phoneNumber").not().isEmpty(),
    body("otp").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phoneNumber, otp } = req.body;

        try {

            if (otp !== '1234') {
                res.status(400).json({ message: "Incorrect Otp" });
            } else {
                const user = await userModel.findOne({ phoneNumber });

                if (user) {
    
                    const token = await createToken(user);
                    res.status(201).json({ message: "Successfully Logged In", user, token });
    
                } else {
                    throw Error("User Not Found");
                }
            }

            

        } catch (err) {

            let error = err.message;
            res.status(400).json({ error: error });

        }
    },
    
];

module.exports.registerUser = [

    body("name").not().isEmpty(),
    body("phoneNumber").not().isEmpty(),
    body("gender").not().isEmpty(),
    body("userType").not().isEmpty(),
    body("longitude").not().isEmpty(),
    body("latitude").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { name, phoneNumber, gender, longitude, latitude, userType } = req.body;
  
        try {

            const user = await userModel.create({ name, phoneNumber, gender, location:{type: "Point", coordinates: [longitude, latitude]}, userType, IsOnline: true });
            res.status(201).json({ user: user, message: "User Registered Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.sendOtp = [
  
    body("phoneNumber").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phoneNumber } = req.body;

        try {

            res.status(201).json({ message: "Otp Sent successfully" });

        } catch (err) {

            let error = err.message;
            res.status(400).json({ error: error });

        }
    },
    
];