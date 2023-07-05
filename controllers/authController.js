const { body, validationResult } = require('express-validator');
const { createToken } = require('../middlewares/verifyToken');
const userModel = require('../models/userModel');

module.exports.loginUser = [
    body('phoneNumber').not().isEmpty(),
    body('otp').not().isEmpty(),
    body('fcmToken').not().isEmpty(),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phoneNumber, otp, fcmToken } = req.body;

        try {
            if (otp !== '1234') {
                res.status(400).json({ message: 'Incorrect Otp' });
            } else {

                const user = await userModel.findOneAndUpdate(
                    { phoneNumber },
                    { fcmToken },
                    { new: true }
                ).lean();

                if (user) {
                    let isProfileCompleted = false;

                    if (
                        user?.name &&
                        user?.gender &&
                        user?.jobTitle &&
                        user?.dob &&
                        user?.interests?.length > 0 &&
                        user?.images?.length > 0
                    ) {
                        isProfileCompleted = true;
                    }

                    user.isProfileCompleted = isProfileCompleted;

                    const token = await createToken(user);
                    res.status(201).json({
                        message: 'Successfully Logged In',
                        isProfileCompleted,
                        user,
                        token,
                    });
                } else {
                    throw Error('User Not Found');
                }
            }
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];

module.exports.loginAdmin = [
    body('email').not().isEmpty(),
    body('password').not().isEmpty(),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            if (password !== 'Dilsay@2022') {
                res.status(400).json({ message: 'Incorrect Password' });
            } else {
                const user = await userModel.findOne({ email }).lean();

                if (user) {
                    const token = await createToken(user);
                    res.status(201).json({
                        message: 'Successfully Logged In',
                        user,
                        token,
                    });
                } else {
                    throw Error('User Not Found');
                }
            }
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];

module.exports.registerUser = [
    body('name').not().isEmpty(),
    body('phoneNumber').not().isEmpty(),
    body('gender').not().isEmpty(),
    body('userType').not().isEmpty(),
    body('longitude').not().isEmpty(),
    body('latitude').not().isEmpty(),
    body('otp').not().isEmpty(),
    body('fcmToken').not().isEmpty(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            phoneNumber,
            gender,
            longitude,
            latitude,
            userType,
            otp,
            fcmToken
        } = req.body;

        try {
            if (otp !== '1234') {
                res.status(400).json({ message: 'Incorrect Otp' });
            } else {
                await userModel.create({
                    name,
                    phoneNumber,
                    gender,
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    userType,
                    IsOnline: true,
                    fcmToken
                });
                let user = await userModel.findOne({ phoneNumber }).lean();
                let isProfileCompleted = false;

                let oppGender = (gender === "Male") ? "Female" : "Male"

                const preferences = await preferenceModel.findOneAndUpdate({ user: req.user._id }, { gender : oppGender, startAge: 18, endAge: 22, longitude, latitude, distance: 5 }, { upsert: true });

                if (
                    user?.name &&
                    user?.gender &&
                    user?.jobTitle &&
                    user?.dob &&
                    user?.interests?.length > 0 &&
                    user?.images?.length > 0
                ) {
                    isProfileCompleted = true;
                }

                const token = await createToken(user);
                user.isProfileCompleted = isProfileCompleted;
                res.status(201).json({
                    user: user,
                    token,
                    message: 'User Registered Successfully',
                });
            }
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];

module.exports.sendOtp = [
    body('phoneNumber').not().isEmpty(),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phoneNumber } = req.body;

        try {
            const user = await userModel.findOne({ phoneNumber });
            const { type } = req.query;

            if (user) {
                if (type == 'login') {
                    res.status(201).json({ message: 'Otp Sent successfully' });
                } else {
                    res.status(400).json({ message: 'User already exist' });
                }
            } else {
                if (type == 'login') {
                    res.status(400).json({ message: 'User not found' });
                } else {
                    res.status(201).json({ message: 'Otp Sent successfully' });
                }
            }
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];
