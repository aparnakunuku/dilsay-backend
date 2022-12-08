const { body, validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("../config/firebase");
const inviteModel = require("../models/inviteModel");
const gameInfoModel = require("../models/gameInfoModel");

module.exports.showAllProfiles = async (req, res) => {
    
    try {

        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let skip = (page - 1) * pageSize;

        let rejected = { _id: { $nin: req?.user?.rejected } };
        let blocked = { _id: { $nin: req?.user?.blocked } };
        let blockedBy = { _id: { $nin: req?.user?.blockedBy } };

        let distance = req.query.distance || 30;

        let sortByDistance = {
            location:
                { $nearSphere:
                    {
                        $geometry: { type: "Point",  coordinates: [ req.query.longitude, req.query.latitude ] },
                    },
                    $maxDistance: distance
                }
        };

        let gender = req.query.gender || '';
        let genderFilter = gender ? { gender: gender } : {}

        let age = req.query.age || '';
        let ageFilter = age ? { age: age } : {}

        let count = await userModel.countDocuments({ 
            ...rejected,
            ...blocked,
            ...blockedBy,
            ...genderFilter,
            ...ageFilter
        });

        const user = await userModel.find({  
            ...rejected,
            ...blocked,
            ...blockedBy,
            ...sortByDistance,
            ...genderFilter,
            ...ageFilter
        })
        .skip(skip)
        .limit(pageSize);

        res.status(201).json({ count, page, pages: Math.ceil(count / pageSize), user: user, message: "Users Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getMyProfile = async (req, res) => {
    
    try {

        const user = await userModel.find({ _id: req.user._id }).populate('interests subscription.package');

        res.status(201).json({ user: user, message: "Profile details Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.editProfile = [

    body("name").not().isEmpty(),
    body("gender").not().isEmpty(),
    body("jobTitle").not().isEmpty(),
    body("dob").not().isEmpty(),
    body("email").not().isEmpty(),
    body("bio").not().isEmpty(),
    body("interests").not().isEmpty(),

    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { name, gender, jobTitle, dob, email, bio, interests } = req.body;
  
        try {

            let image1Link = req.body?.image1;
            let image2Link = req.body?.image1;
            let image3Link = req.body?.image1;
            let image4Link = req.body?.image1;

            if (req.files?.image1) {
                const imageRef = ref(storage, `image/${ Date.now() + '.' + req.files?.image1.name.split('.')[1]} `);
                
                await uploadBytes(imageRef, req.files?.image1.data)
                    .then(snapshot => {
                        return getDownloadURL(snapshot.ref)
                    })
                    .then(downloadURL => {
                        image1Link = downloadURL
                    })
                    .catch(error => {
                        throw Error(error);
                    })
            }

            if (req.files?.image2) {
                const imageRef = ref(storage, `image/${ Date.now() + '.' + req.files?.image2.name.split('.')[1]} `);
                
                await uploadBytes(imageRef, req.files?.image2.data)
                    .then(snapshot => {
                        return getDownloadURL(snapshot.ref)
                    })
                    .then(downloadURL => {
                        image2Link = downloadURL
                    })
                    .catch(error => {
                        throw Error(error);
                    })
            }

            if (req.files?.image3) {
                const imageRef = ref(storage, `image/${ Date.now() + '.' + req.files?.image3.name.split('.')[1]} `);
                
                await uploadBytes(imageRef, req.files?.image3.data)
                    .then(snapshot => {
                        return getDownloadURL(snapshot.ref)
                    })
                    .then(downloadURL => {
                        image3Link = downloadURL
                    })
                    .catch(error => {
                        throw Error(error);
                    })
            }

            if (req.files?.image4) {
                const imageRef = ref(storage, `image/${ Date.now() + '.' + req.files?.image4.name.split('.')[1]} `);
                
                await uploadBytes(imageRef, req.files?.image4.data)
                    .then(snapshot => {
                        return getDownloadURL(snapshot.ref)
                    })
                    .then(downloadURL => {
                        image4Link = downloadURL
                    })
                    .catch(error => {
                        throw Error(error);
                    })
            }

            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { name, images: [ image1Link, image2Link, image3Link, image4Link ], gender, jobTitle, dob, email, bio, interests: JSON.parse(interests) });
            res.status(201).json({ user: user, message: "Profile Updated Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.updateUserLocation = [

    body("longitude").not().isEmpty(),
    body("latitude").not().isEmpty(),

    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { longitude, latitude } = req.body;
  
        try {

            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { location:{type: "Point", coordinates: [longitude, latitude]} });
            res.status(201).json({ user: user, message: "Successfully Updated User Location" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.changeOnlineStatus = [

    body("isOnline").not().isEmpty(),

    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { isOnline } = req.body;
  
        try {

            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { isOnline });
            res.status(201).json({ user: user, message: "Successfully Updated Online Status" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.verifyProfile = [

    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
  
        try {

            let imageLink = req.body?.image;

            if (req.files?.image) {
                const imageRef = ref(storage, `verification-image/${ Date.now() + '.' + req.files?.image.name.split('.')[1]} `);
                
                await uploadBytes(imageRef, req.files?.image.data)
                    .then(snapshot => {
                        return getDownloadURL(snapshot.ref)
                    })
                    .then(downloadURL => {
                        imageLink = downloadURL
                    })
                    .catch(error => {
                        throw Error(error);
                    })
            }

            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { verification: { verificationImage: imageLink, verificationMessage: "Pending for verification" } });
            res.status(201).json({ user: user, message: "Profile Updated Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.deleteMyAccount = async (req, res) => {
    
    try {

        const game = await gameInfoModel.findOneAndDelete({ $or: [ { user1: req.user._id }, { user2: req.user._id } ] });

        const invite = await inviteModel.findOneAndDelete({ $or: [ { sentTo: req.user._id }, { sentBy: req.user._id } ] });

        const user = await userModel.findOneAndDelete({ _id: req.user._id });

        res.status(201).json({ user: user, message: "User deleted Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.blockUser = [

    body("userId").not().isEmpty(),

    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { userId } = req.body;
  
        try {

            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { $push: { blocked: userId } });
            const user1 = await userModel.findOneAndUpdate({ _id: userId }, { $push: { blockedBy: req.user._id } });

            const game = await gameInfoModel.findOne({ $or: [ { user1: req.user._id }, { user1: userId } ], $or: [ { user2: req.user._id }, { user2: userId } ] });

            res.status(201).json({ user: user, message: "Successfully Updated Online Status" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.rejectUser = [

    body("userId").not().isEmpty(),

    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { userId } = req.body;
  
        try {

            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { $push: { rejected: userId } });
            const user1 = await userModel.findOneAndUpdate({ _id: userId }, { $push: { rejectedBy: req.user._id } });

            res.status(201).json({ user: user, message: "Successfully Updated Online Status" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.buySubscription = [

    body("subscriptionId").not().isEmpty(),

    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { subscriptionId } = req.body;
  
        try {

            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { subscription: { package: subscriptionId, subscribedAt: Date.now() } });
            res.status(201).json({ user: user, message: "Subscription added successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.addToViewedProfiles = [

    body("viewedProfiles").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { viewedProfiles } = req.body;
  
        try {

            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { $addToSet: {viewedProfiles: {$each: viewedProfiles}} });
            res.status(201).json({ user: user, message: "Profiles Added to viewed profiles Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]