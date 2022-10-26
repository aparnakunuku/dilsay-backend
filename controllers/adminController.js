const { body, validationResult } = require("express-validator");
const interestModel = require("../models/interestModel");
const userModel = require("../models/userModel");


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

        const interests = await interestModel.find({  });

        res.status(201).json({ interests: interests, message: "Interests Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.confirmVerification = [

    body("userId").not().isEmpty(),
    body("isVerified").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { userId, isVerified, verificationMessage } = req.body;
  
        try {

            const user = await userModel.findOneAndUpdate({ _id: userId }, { $set: { 'verification.isVerified': isVerified, 'verification.verificationMessage': verificationMessage } });
            res.status(201).json({ user: user, message: "Verification Status Updated" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]