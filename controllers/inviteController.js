const { body, validationResult } = require("express-validator");
const inviteModel = require("../models/inviteModel");

module.exports.sendInvite = [

    body("sentTo").not().isEmpty(),
    body("pickupLine").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { sentTo, pickupLine } = req.body;
  
        try {

            const invite = await inviteModel.create({ sentTo, sentBy: req.user._id, pickupLine });
            res.status(201).json({ invite: invite, message: "Invite sent Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getAllInvitesSent = async (req, res) => {
    
    try {

        const invites = await inviteModel.find({ sentBy: req.user._id, inviteStatus: 'Pending' });

        res.status(201).json({ invites: invites, message: "Sent Invites Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getAllInvitesRecieved = async (req, res) => {
    
    try {

        const invites = await inviteModel.find({ sentTo: req.user._id, inviteStatus: 'Pending' });

        res.status(201).json({ invites: invites, message: "Recieved Invites Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.acceptOrRejectInvite = [

    body("inviteId").not().isEmpty(),
    body("inviteStatus").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { inviteId, inviteStatus } = req.body;
  
        try {

            const invite = await inviteModel.findOneAndUpdate({ _id: inviteId, sentTo: req.user._id }, { inviteStatus });

            res.status(201).json({ invite: invite, message: "Invite sent Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getAllMatches = async (req, res) => {
    
    try {

        const invites = await inviteModel.find({  $or: [{sentTo: req.user._id}, {sentBy: req.user._id}], inviteStatus: 'Accepted' });

        res.status(201).json({ invites: invites, message: "Recieved Invites Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}