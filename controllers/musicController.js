const { body, validationResult } = require("express-validator");
const musicCategoryModel = require("../models/musicCategoryModel");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("../config/firebase");
const musicModel = require("../models/musicModel");

module.exports.addMusicCategory = [

    body("categoryName").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { categoryName } = req.body;
  
        try {

            const musicCategory = await musicCategoryModel.create({ categoryName });
            res.status(201).json({ musicCategory: musicCategory, message: "Music Category created Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.deleteMusicCategory = async (req, res) => {
    
    try {

        const musicCategory = await musicCategoryModel.findOneAndDelete({ _id: req.params.id });

        if (musicCategory) {
            res.status(201).json({ musicCategory: musicCategory, message: "Music Category Deleted Successfully" });
        } else {
            throw Error("Cannot find Music Category");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getAllMusicCategories = async (req, res) => {
    
    try {

        const musicCategories = await musicCategoryModel.find({  });

        res.status(201).json({ musicCategories: musicCategories, message: "Music Categories Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.addMusic = [

    body("musicName").not().isEmpty(),
    body("categoryId").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { musicName, categoryId } = req.body;
        const { audio } = req.files;
  
        try {

            const audioRef = ref(storage, `music/${ Date.now() + audio.name.split('.')[1]} `);
            let audioLink 
            await uploadBytes(audioRef, audio.data)
            .then(snapshot => {
                return getDownloadURL(snapshot.ref)
            })
            .then(downloadURL => {
                audioLink = downloadURL
            })
            .catch(error => {
                throw Error(error);
            })

            const music = await musicModel.create({ musicName, categoryName: categoryId, audioLink });
            res.status(201).json({ music: music, message: "Music created Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.updateMusic = [

    body("musicId").not().isEmpty(),
    body("musicName").not().isEmpty(),
    body("categoryId").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
  
        try {

            let audioLink = req.body?.audio;

            const music = await musicModel.findOneAndUpdate({ _id: req?.body?.musicId }, { musicName: req?.body?.musicName, audioLink, categoryName: req?.body?.categoryId });
            res.status(201).json({ music: music, message: "Music created Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getMusicById = async (req, res) => {
    
    try {

        const music = await musicModel.findOne({ _id: req.params.id });

        if (music) {
            res.status(201).json({ music: music, message: "Music Fetched Successfully" });
        } else {
            throw Error("Cannot find Music");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.deleteMusic = async (req, res) => {
    
    try {

        const music = await musicModel.findOneAndDelete({ _id: req.params.id });

        if (music) {
            res.status(201).json({ music: music, message: "Music Deleted Successfully" });
        } else {
            throw Error("Cannot find Music");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getAllMusic = async (req, res) => {
    
    try {

        const music = await musicModel.find({  });

        res.status(201).json({ music: music, message: "Music Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}