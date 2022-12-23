const { body, validationResult } = require("express-validator");
const interestModel = require("../models/interestModel");
const userModel = require("../models/userModel");
const verificationModel = require("../models/verificationModel");

module.exports.getAllUsers = async (req, res) => {
    
    try {

        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let skip = (page - 1) * pageSize;

        const search = req.query.search || '';
        const searchFilter = search ? { name: { $regex: search, $options: 'i' } } : {};

        let count = await userModel.countDocuments({
            userType: "User",
            ...searchFilter,
        });

        const users = await userModel.find({
            userType: "User",
            ...searchFilter,
        })
        .skip(skip)
        .limit(pageSize);

        res.status(201).json({ count, page, pages: Math.ceil(count / pageSize), users: users, message: "Users fetched successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

};

module.exports.deleteUser = async (req, res) => {
    
    try {

        const user = await userModel.findOneAndDelete({ _id: req.params.id });

        if (user) {
            res.status(201).json({ user: user, message: "User Deleted Successfully" });
        } else {
            throw Error("Cannot find User");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.addInterest = [

    body("title").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { title } = req.body;
  
        try {

            const interest = await interestModel.create({ title });
            res.status(201).json({ interest: interest, message: "Interest created Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.updateInterest = [

    body("interestId").not().isEmpty(),
    body("title").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { interestId, title } = req.body;
  
        try {

            const interest = await interestModel.findByIdAndUpdate({ _id: interestId }, { title });
            res.status(201).json({ interest: interest, message: "Interest updated Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getInterestById = async (req, res) => {
    
    try {

        const interest = await interestModel.findOne({ _id: req.params.id });

        if (interest) {
            res.status(201).json({ interest: interest, message: "Interest Fetched Successfully" });
        } else {
            throw Error("Cannot find Intrest");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.deleteInterest = async (req, res) => {
    
    try {

        const interest = await interestModel.findOneAndDelete({ _id: req.params.id });

        if (interest) {
            res.status(201).json({ interest: interest, message: "Interest Deleted Successfully" });
        } else {
            throw Error("Cannot find Intrest");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getAllInterests = async (req, res) => {
    
    try {

        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let skip = (page - 1) * pageSize;

        const search = req.query.search || '';
        const searchFilter = search ? { title: { $regex: search, $options: 'i' } } : {};

        let count = await interestModel.countDocuments({
            ...searchFilter,
        });

        const interests = await interestModel.find({ 
            ...searchFilter,
        })
        .skip(skip)
        .limit(pageSize);

        res.status(201).json({ count, page, pages: Math.ceil(count / pageSize), interests: interests, message: "Interests Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.updateVerificationStatus = [

    body("userId").not().isEmpty(),
    body("verificationStatus").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { userId, verificationStatus, verificationMessage } = req.body;
  
        try {

            const verification = await verificationModel.findOneAndUpdate({ user: userId }, { verificationStatus, verificationMessage }, { upsert: true });
            
            if (verificationStatus === 'Accepted') {
                await userModel.findOneAndUpdate({ _id: userId }, { isVerified: true })
            }

            res.status(201).json({ verification: verification, message: "Verification status updated Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getPendingVerificationRequest = async (req, res) => {
    
    try {

        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let skip = (page - 1) * pageSize;

        let count = await verificationModel.countDocuments({
            verificationStatus: 'Pending',
        });

        const verifications = await verificationModel.find({ 
            verificationStatus: 'Pending',
        })
        .populate('user', 'name phoneNumber')
        .skip(skip)
        .limit(pageSize);

        res.status(201).json({ count, page, pages: Math.ceil(count / pageSize), verifications: verifications, message: "Verification Requests Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getVerificationById = async (req, res) => {
    
    try {

        const verification = await verificationModel.findOne({ user: req.params.id }).populate('user', 'images');

        if (verification) {
            res.status(201).json({ verification: verification, message: "Verification Successfully" });
        } else {
            throw Error("Cannot find Verification");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}