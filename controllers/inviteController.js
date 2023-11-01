const { body, validationResult } = require("express-validator");
const inviteModel = require("../models/inviteModel");
const notificationModel = require("../models/notificationModel");
const userModel = require("../models/userModel");

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

            const user = await userModel.findOne({ _id: req.user._id });

            let date = new Date();
            date.setDate(date.getDate() - 1);

            if (user.invitesSentCount == 25 && date > user?.invitesSentTime) {
                res.status(400).json({ message: "Max invites already sent for the day" });
            } else {

                const invite = await inviteModel.create({ sentTo, sentBy: req.user._id, pickupLine });
                const user = await userModel.findOneAndUpdate(
                    { _id: req.user._id },
                    { $push: { invitedProfiles: sentTo } }
                );
                const notification = await notificationModel.create({ user: sentTo, refUser: req.user._id, body: `${user.name} sent you an invite.` })

                let u = await userModel.findOne({ _id: refUser })

                let headers = { 
                    'Authorization': 'key=AAAAIkbj4C4:APA91bFY3e4nCIaodc-18ruDbz6uu_NEz2pFCSnzkcj9-GV2V802y2Q6kDmsQwh46yaD8c1Cq1CNExpzPydbOJtnHB3icgHf5SHzjkeCRetQWR_lAsBhYi3FMu2S60xajIDWJv9igsJ6', 
                    'Content-Type': 'application/json'
                }

                let payload = {
                    "registration_ids": [u.fcmToken],
                    "notification": {
                        "body": `${user.name} sent you an invite.`,
                        "title": "New invite",
                        "android_channel_id": "dilsay",
                        "sound": "default"
                    },
                    "apns": {
                        "payload": {
                            "aps": {
                                "contentAvailable": true
                            }
                        },
                        "headers": {
                            "apns-priority": "10"
                        }
                    }
                }

                let result = await axios.post('https://fcm.googleapis.com/fcm/send', payload, {headers: headers});

                if (user.invitesSentCount === 24) {
                    const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { invitesSentTime: Date.now(), $inc: { invitesSentCount: 1 } });
                } else {
                    const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { invitesSentCount: 1, invitesSentTime: null  });
                }
                
                res.status(201).json({ invite: invite, message: "Invite sent Successfully" });

            }
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getAllInvitesSent = async (req, res) => {
    
    try {

        const invites = await inviteModel.find({ sentBy: req.user._id, inviteStatus: 'Pending' }).populate('sentTo');

        res.status(201).json({ invites: invites, message: "Sent Invites Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getAllInvitesRecieved = async (req, res) => {
    
    try {

        const invites = await inviteModel.find({ sentTo: req.user._id, inviteStatus: 'Pending' }).populate('sentBy');

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

            const user = await userModel.findOne({ _id: req.user._id });

            let date = new Date();
            date.setDate(date.getDate() - 1);

            if (inviteStatus === 'Accepted' && user.invitesAcceptedCount >= 10 && date > user?.invitesAcceptedTime) {
                res.status(400).json({ message: "Max invites already accepted for the day" });
            } else {

                const invite = await inviteModel.findOneAndUpdate({ _id: inviteId, sentTo: req.user._id }, { inviteStatus });
                const notification = await notificationModel.create({ user: invite.sentBy, refUser: req.user._id, body: `${user.name} ${inviteStatus} your invite.` })

                let u = await userModel.findOne({ _id: invite.sentBy })

                let headers = { 
                    'Authorization': 'key=AAAAIkbj4C4:APA91bFY3e4nCIaodc-18ruDbz6uu_NEz2pFCSnzkcj9-GV2V802y2Q6kDmsQwh46yaD8c1Cq1CNExpzPydbOJtnHB3icgHf5SHzjkeCRetQWR_lAsBhYi3FMu2S60xajIDWJv9igsJ6', 
                    'Content-Type': 'application/json'
                }

                let payload = {
                    "registration_ids": [u.fcmToken],
                    "notification": {
                        "body": `${user.name} ${inviteStatus} your invite.`,
                        "title": `Invite ${inviteStatus}`,
                        "android_channel_id": "dilsay",
                        "sound": "default"
                    },
                    "apns": {
                        "payload": {
                            "aps": {
                                "contentAvailable": true
                            }
                        },
                        "headers": {
                            "apns-priority": "10"
                        }
                    }
                }

                let result = await axios.post('https://fcm.googleapis.com/fcm/send', payload, {headers: headers});

                if (inviteStatus === 'Accepted' && user.invitesAcceptedCount == 9) {
                    const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { invitesAcceptedTime: Date.now(), $inc: { invitesAcceptedCount: 1 } });
                } else {
                    const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { invitesAcceptedCount: 1, invitesAcceptedTime: null  });
                }

                res.status(201).json({ invite: invite, message: "Invite sent Successfully" });

            }
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getAllMatches = async (req, res) => {
    
    try {

        let search = req.query.search || '';

        const invites = await inviteModel.find({  
            $or: [{sentTo: req.user._id}, {sentBy: req.user._id}], inviteStatus: 'Accepted'
        })
        .populate({
            path: 'sentTo sentBy',
        })
        .lean()

        if (search !== '') {

            for(let i = 0; i < invites.length; i++) {
            
                if (invites[i].sentTo.name.toLowerCase() === req.user.name.toLowerCase() && invites[i].sentBy.name.toLowerCase().includes(search.toLowerCase())) {
                    delete invites[i].sentTo
                    invites[i].user = invites[i].sentBy
                    delete invites[i].sentBy
                } else if (invites[i].sentBy.name.toLowerCase() === req.user.name.toLowerCase() && invites[i].sentTo.name.toLowerCase().includes(search.toLowerCase())) {
                    delete invites[i].sentBy
                    invites[i].user = invites[i].sentTo
                    delete invites[i].sentTo
                }

            }
        }

        res.status(201).json({ matches: invites, message: "Matches Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}