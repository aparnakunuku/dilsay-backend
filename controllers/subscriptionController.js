const { body, validationResult } = require("express-validator");
const subscriptionModel = require("../models/subscriptionModel");

module.exports.createSubscription = [

    body("price").not().isEmpty(),
    body("validityPeriod").not().isEmpty(),
    body("discount").not().isEmpty(),
    body("isActive").not().isEmpty(),
    body("features").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { price, validityPeriod, discount, isActive, features } = req.body;
  
        try {

            const subscription = await subscriptionModel.create({ price, validityPeriod, discount, isActive, features });
            res.status(201).json({ subscription: subscription, message: "Subscription created Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.updateSubscription = [

    body("subscriptionId").not().isEmpty(),
    body("price").not().isEmpty(),
    body("validityPeriod").not().isEmpty(),
    body("discount").not().isEmpty(),
    body("isActive").not().isEmpty(),
    body("features").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { subscriptionId, price, validityPeriod, discount, isActive, features } = req.body;
  
        try {

            const subscription = await subscriptionModel.findOneAndUpdate({ _id: subscriptionId }, { price, validityPeriod, discount, isActive, features });
            res.status(201).json({ subscription: subscription, message: "Subscription updated Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getSubscriptionById = async (req, res) => {
    
    try {

        const subscription = await subscriptionModel.findOne({ _id: req.params.id });

        if (subscription) {
            res.status(201).json({ subscription: subscription, message: "Subscription Fetched Successfully" });
        } else {
            throw Error("Cannot find Subscription");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.deleteSubscription = async (req, res) => {
    
    try {

        const subscription = await subscriptionModel.findOneAndDelete({ _id: req.params.id });

        if (subscription) {
            res.status(201).json({ subscription: subscription, message: "Subscription Deleted Successfully" });
        } else {
            throw Error("Cannot find Subscription");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getAllSubscriptions = async (req, res) => {
    
    try {

        const subscriptions = await subscriptionModel.find({  });

        res.status(201).json({ subscriptions: subscriptions, message: "Subscriptions Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}