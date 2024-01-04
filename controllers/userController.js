const { body, validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const inviteModel = require('../models/inviteModel');
const gameInfoModel = require('../models/gameInfoModel');
const notificationModel = require('../models/notificationModel');
const chatModel = require('../models/chatModel');
const messageModel = require('../models/messageModel');
const verificationModel = require('../models/verificationModel');
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require('../config/s3');
const preferenceModel = require('../models/preferenceModel');
const axios = require("axios");

module.exports.showAllProfiles = async (req, res) => {
    
    try {
        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let skip = (page - 1) * pageSize;

        const user = await userModel
            .findOne({ _id: req.user._id });
        
        let notInclude = user?.rejected.concat(user?.rejectedBy, user?.invitedProfiles,user?.blocked, user?.blockedBy);
        
        let distance = req.query.distance || 30;

        let sortByDistance = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [req.query.longitude, req.query.latitude],
                    },
                    $maxDistance: distance * 1000,
                },
            },
        };

        let gender = req.query.gender || '';
        let genderFilter = gender ? { gender: gender } : {};

        let startAge = req.query.startAge || '';
        let endAge = req.query.endAge || '';
        let ageFilter =
            startAge && endAge
                ? { age: { $gte: startAge, $lte: endAge } }
                : startAge && !endAge
                ? { age: { $gte: startAge } }
                : !startAge && endAge
                ? { age: { $lte: endAge } }
                : {};

        let count = await userModel.countDocuments({
            ...genderFilter,
            ...ageFilter,
            //_id: { $ne: req.user._id },
            userType: { $ne:'Super Admin' },
            //_id: { $nin: notInclude }
            _id: { $nin: [...notInclude, req.user._id] },
        });

        const users = await userModel
            .find({
                ...sortByDistance,
                ...genderFilter,
                ...ageFilter,
                //_id: { $ne: req.user._id },
                userType: { $ne:'Super Admin' },
                //_id: { $nin: notInclude }
                _id: { $nin: [...notInclude, req.user._id] },

            })
            .skip(skip)
            .limit(pageSize)
            .populate('interests')
            .lean();

        for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < users[i].images.length; j++) {
                for (let k = 0; k < users[i].images[j].likes.length; k++) {
                    if (users[i].images[j].likes[k].equals(req.user._id)) {
                        users[i].images[j].isLiked = true;
                    } else {
                        users[i].images[j].isLiked = false;
                    }
                }

                delete users[i].images[j].likes;

                for (let k = 0; k < users[i].images[j].loves.length; k++) {
                    if (users[i].images[j].loves[k].equals(req.user._id)) {
                        users[i].images[j].isLoved = true;
                    } else {
                        users[i].images[j].isLoved = false;
                    }
                }

                delete users[i].images[j].loves;
            }
        }
const userid = req.user._id;
        res.status(201).json({
            userid,
            count,
            page,
            pages: Math.ceil(count / pageSize),
            users: users,
            message: 'Users Fetched Successfully',
        });
    } catch (err) {
        let error = err.message;
        res.status(400).json({ error: error });
    }
};

module.exports.getMyProfile = async (req, res) => {
    try {
        var user = await userModel
            .findOne({ _id: req.user._id })
            .populate('interests subscription.package')
            .lean();

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
        res.status(201).json({
            user: user,
            message: 'Profile details Fetched Successfully',
        });
    } catch (err) {
        let error = err.message;
        res.status(400).json({ error: error });
    }
};

module.exports.editProfile = [
    body('name').not().isEmpty(),
    body('gender').not().isEmpty(),
    body('jobTitle').not().isEmpty(),
    body('dob').not().isEmpty(),
    body('interests').not().isEmpty(),
    body('isHideAge').not().isEmpty(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            gender,
            jobTitle,
            dob,
            email,
            bio,
            interests,
            isHideAge,
        } = req.body;

        try {
            let image1Link = req.body?.image1;
            let image2Link = req.body?.image2;
            let image3Link = req.body?.image3;
            let image4Link = req.body?.image4;
            let image5Link = req.body?.image5;

            if (req.files?.image1) {

                const key = `image/${
                    Date.now() + '-' + req.files?.image1.name
                }`

                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: key,
                    Body: req.files?.image1.data,
                });
                  
                const [res, region] = await Promise.all([
                s3Client.send(command),
                s3Client.config.region(),
                ]);
                
                const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`
                image1Link = url
            }

            if (req.files?.image2) {
                const key = `image/${
                    Date.now() + '-' + req.files?.image2.name
                }`

                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: key,
                    Body: req.files?.image2.data,
                });
                  
                const [res, region] = await Promise.all([
                s3Client.send(command),
                s3Client.config.region(),
                ]);
                
                const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`
                image2Link = url
            }

            if (req.files?.image3) {
                const key = `image/${
                    Date.now() + '-' + req.files?.image3.name
                }`

                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: key,
                    Body: req.files?.image3.data,
                });
                  
                const [res, region] = await Promise.all([
                s3Client.send(command),
                s3Client.config.region(),
                ]);
                
                const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`
                image3Link = url
            }

            if (req.files?.image4) {
                const key = `image/${
                    Date.now() + '-' + req.files?.image4.name
                }`

                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: key,
                    Body: req.files?.image4.data,
                });
                  
                const [res, region] = await Promise.all([
                s3Client.send(command),
                s3Client.config.region(),
                ]);
                
                const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`
                image4Link = url
            }

            if (req.files?.image5) {
                const key = `image/${
                    Date.now() + '-' + req.files?.image5.name
                }`

                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: key,
                    Body: req.files?.image5.data,
                });
                  
                const [res, region] = await Promise.all([
                s3Client.send(command),
                s3Client.config.region(),
                ]);
                
                const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`
                image5Link = url
            }

            let image1 = image1Link ? { link: image1Link } : {};
            let image2 = image2Link ? { link: image2Link } : null;
            let image3 = image3Link ? { link: image3Link } : null;
            let image4 = image4Link ? { link: image4Link } : null;
            let image5 = image5Link ? { link: image5Link } : null;

            let images = [image1];

            if (image2) {
                images.push(image2);
            }
            if (image3) {
                images.push(image3);
            }
            if (image4) {
                images.push(image4);
            }
            if (image5) {
                images.push(image5);
            }

            const user = await userModel.findOneAndUpdate(
                { _id: req.user._id },
                {
                    name,
                    images,
                    gender,
                    jobTitle,
                    dob,
                    email,
                    bio,
                    interests: JSON.parse(interests),
                    isHideAge,
                },
                { new: true }
            );
            res.status(201).json({
                user: user,
                message: 'Profile Updated Successfully',
            });
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];

module.exports.updateUserLocation = [
    body('longitude').not().isEmpty(),
    body('latitude').not().isEmpty(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { longitude, latitude } = req.body;

        try {
            const user = await userModel.findOneAndUpdate(
                { _id: req.user._id },
                {
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                }
            );
            res.status(201).json({
                user: user,
                message: 'Successfully Updated User Location',
            });
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];

module.exports.changeOnlineStatus = [
    body('isOnline').not().isEmpty(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { isOnline } = req.body;

        try {
            const user = await userModel
                .findOne({ _id: req.user._id })
                .populate('subscription.package');

            let date = new Date();
            let validityPeriod = parseInt(
                user?.subscription?.package?.validityPeriod.substring(
                    0,
                    user?.subscription?.package?.validityPeriod.length - 1
                )
            );
            date.setDate(date.getDate() + validityPeriod);

            if (Date.now() > date) {
                await userModel.findOneAndUpdate(
                    { _id: req.user._id },
                    { isOnline, subscription: null }
                );
            } else {
                await userModel.findOneAndUpdate(
                    { _id: req.user._id },
                    { isOnline }
                );
            }

            const user1 = res.status(201).json({
                user: user,
                message: 'Successfully Updated Online Status',
            });
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];

module.exports.verifyProfile = [
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let imageLink = req.body?.image;

            if (req.files?.image) {

                const key = `verification-image/${
                    Date.now() + '-' + req.files?.image.name
                }`

                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: key,
                    Body: req.files?.image.data,
                });
                  
                const [res, region] = await Promise.all([
                s3Client.send(command),
                s3Client.config.region(),
                ]);
                
                const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`
                imageLink = url

            }

            const verification = await verificationModel.findOneAndUpdate(
                { user: req.user._id },
                {
                    verificationImage: imageLink,
                    verificationStatus: 'Pending',
                    verificationMessage: 'Pending for verification',
                },
                { upsert: true, new: true }
            );
            res.status(201).json({
                verification: verification,
                message: 'Verification requested Successfully',
            });
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];

module.exports.deleteMyAccount = async (req, res) => {
    try {
        const notifications = await notificationModel.deleteMany({
            $or: [{ user: req.user._id }, { refUser: req.user._id }],
        });

        const game = await gameInfoModel.deleteMany({
            $or: [{ user1: req.user._id }, { user2: req.user._id }],
        });

        const invite = await inviteModel.deleteMany({
            $or: [{ sentTo: req.user._id }, { sentBy: req.user._id }],
        });

        const chat = await chatModel
            .find({ users: { $elemMatch: { $eq: req.user._id } } })
            .select('_id');

        await chatModel.deleteMany({
            users: { $elemMatch: { $eq: req.user._id } },
        });

        const messages = await messageModel.deleteMany({ chat: chat });

        const user = await userModel.findOneAndDelete({ _id: req.user._id });

        res.status(201).json({
            user: user,
            message: 'User deleted Successfully',
        });
    } catch (err) {
        let error = err.message;
        res.status(400).json({ error: error });
    }
};

module.exports.blockUser = [
    body('userId').not().isEmpty(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.body;

        try {
            const user = await userModel.findOneAndUpdate(
                { _id: req.user._id },
                { $push: { blocked: userId } }
            );
            const user1 = await userModel.findOneAndUpdate(
                { _id: userId },
                { $push: { blockedBy: req.user._id } }
            );

            const game = await gameInfoModel.findOne({
                $or: [{ user1: req.user._id }, { user1: userId }],
                $or: [{ user2: req.user._id }, { user2: userId }],
            });

            const chat = await chatModel.findOneAndDelete({
                $and: [
                    { users: { $elemMatch: { $eq: req.user._id } } },
                    { users: { $elemMatch: { $eq: userId } } },
                ],
            });

            const messages = messageModel.deleteMany({ chat: chat._id });

            res.status(201).json({
                user: user,
                message: 'Successfully Updated Online Status',
            });
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];

module.exports.rejectUser = [
    body('userId').not().isEmpty(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.body;

        try {
            const user = await userModel.findOneAndUpdate(
                { _id: req.user._id },
                { $push: { rejected: userId } }
            );
            const user1 = await userModel.findOneAndUpdate(
                { _id: userId },
                { $push: { rejectedBy: req.user._id } }
            );

            res.status(201).json({
                user: user,
                message: 'Successfully Updated Online Status',
            });
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];

module.exports.buySubscription = [
    body('subscriptionId').not().isEmpty(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { subscriptionId } = req.body;

        try {
            const user = await userModel.findOneAndUpdate(
                { _id: req.user._id },
                {
                    subscription: {
                        package: subscriptionId,
                        subscribedAt: Date.now(),
                    },
                }
            );
            res.status(201).json({
                user: user,
                message: 'Subscription added successfully',
            });
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];

module.exports.addToViewedProfiles = [
    body('viewedProfiles').not().isEmpty(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { viewedProfiles } = req.body;

        try {
            const user = await userModel.findOneAndUpdate(
                { _id: req.user._id },
                { $addToSet: { viewedProfiles: { $each: viewedProfiles } } }
            );
            res.status(201).json({
                user: user,
                message: 'Profiles Added to viewed profiles Successfully',
            });
        } catch (err) {
            let error = err.message;
            res.status(400).json({ error: error });
        }
    },
];

module.exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await notificationModel.find({
            user: req.user._id,
        }).populate("refUser", "-password");

        res.status(201).json({
            notifications: notifications,
            message: 'Notifications Fetched Successfully',
        });
    } catch (err) {
        let error = err.message;
        res.status(400).json({ error: error });
    }
};

module.exports.likeImage = async (req, res) => {
    try {
        const user = await userModel.findOne({
            _id: req.params.userId,
            'images._id': req.params.id,
        });
        let isLiked = false;

        if (user) {
            let i = 0;

            for (let x = 0; x < user.images.length; x++) {
                if (user.images[i]._id === req.params.id) {
                    i = x;
                }
            }

            const index = user.images[0].likes.indexOf(req.user._id);

            if (index > -1) {
                user.images[i].likes.splice(index, 1);
                user.images[i].likeCount = user.images[0].likeCount - 1;
                isLiked = false;
                const notification = await notificationModel.findOneAndDelete({
                    user: req.params.userId,
                    refUser: req.user._id,
                    imageId: req.params.id,
                });
            } else {
                user.images[i].likes.push(req.user._id);
                user.images[i].likeCount = user.images[0].likeCount + 1;
                isLiked = true;
                const notification = await notificationModel.create({
                    user: req.params.userId,
                    refUser: req.user._id,
                    imageId: req.params.id,
                    body: `${req.user.name} liked your pic.`,
                });

                let headers = { 
                    'Authorization': 'key=AAAAIkbj4C4:APA91bFY3e4nCIaodc-18ruDbz6uu_NEz2pFCSnzkcj9-GV2V802y2Q6kDmsQwh46yaD8c1Cq1CNExpzPydbOJtnHB3icgHf5SHzjkeCRetQWR_lAsBhYi3FMu2S60xajIDWJv9igsJ6', 
                    'Content-Type': 'application/json'
                }

                let payload = {
                    "registration_ids": [user.fcmToken],
                    "notification": {
                        "body": `${req.user.name} liked your pic.`,
                        "title": "Liked pic",
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

            }

            const updatedUser = await user.save();

            res.status(201).json({ updatedUser, isLiked });
        } else {
            res.status(404).json({
                message: 'User not found',
            });
        }

        
    } catch (err) {
        let error = err.message;
        res.status(400).json({ error: error });
    }
};

module.exports.loveImage = async (req, res) => {
    try {
        const user = await userModel.findOne({
            _id: req.params.userId,
            'images._id': req.params.id,
        });
        let isLoved = false;

        if (user) {
            let i = 0;

            for (let x = 0; x < user.images.length; x++) {
                if (user.images[i]._id === req.params.id) {
                    i = x;
                }
            }

            const index = user.images[0].loves.indexOf(req.user._id);

            if (index > -1) {
                user.images[i].loves.splice(index, 1);
                user.images[i].loveCount = user.images[0].loveCount - 1;
                isLoved = false;
                const notification = await notificationModel.findOneAndDelete({
                    user: req.params.userId,
                    refUser: req.user._id,
                    imageId: req.params.id,
                });
            } else {
                user.images[i].loves.push(req.user._id);
                user.images[i].loveCount = user.images[0].loveCount + 1;
                isLoved = true;
                const notification = await notificationModel.create({
                    user: req.params.userId,
                    refUser: req.user._id,
                    imageId: req.params.id,
                    body: `${req.user.name} loved your pic.`,
                });
            }

            let headers = { 
                'Authorization': 'key=AAAAIkbj4C4:APA91bFY3e4nCIaodc-18ruDbz6uu_NEz2pFCSnzkcj9-GV2V802y2Q6kDmsQwh46yaD8c1Cq1CNExpzPydbOJtnHB3icgHf5SHzjkeCRetQWR_lAsBhYi3FMu2S60xajIDWJv9igsJ6', 
                'Content-Type': 'application/json'
            }

            let payload = {
                "registration_ids": [user.fcmToken],
                "notification": {
                    "body": `${req.user.name} loved your pic.`,
                    "title": "Loved pic",
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


            const updatedUser = await user.save();

            res.status(201).json({ updatedUser, isLoved });
        } else {
            res.status(404).json({
                message: 'User not found',
            });
        }

        
    } catch (err) {
        let error = err.message;
        res.status(400).json({ error: error });
    }
};

module.exports.updatePreferences = [
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { gender, startAge, endAge, longitude, latitude, distance } = req.body;
  
        try {

            const preferences = await preferenceModel.findOneAndUpdate({ user: req.user._id }, { gender, startAge, endAge, longitude, latitude, distance }, { upsert: true });
            res.status(201).json({ preferences: preferences, message: "Prefernces updated Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getPrefernces = async (req, res) => {
    
    try {

        const preferences = await preferenceModel.findOne({ user: req.user._id });

        if (preferences) {
            res.status(201).json({ preferences: preferences, message: "Preferences fetched Successfully" });
        } else {
            throw Error("Cannot find Preferences");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}