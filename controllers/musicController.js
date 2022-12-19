const { body, validationResult } = require("express-validator");
const musicCategoryModel = require("../models/musicCategoryModel");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("../config/firebase");
const musicModel = require("../models/musicModel");
const movieModel = require("../models/movieModel");

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

module.exports.updateMusicCategory = [

    body("categoryId").not().isEmpty(),
    body("categoryName").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { categoryId, categoryName } = req.body;
  
        try {

            const musicCategory = await musicCategoryModel.findByIdAndUpdate({ _id: categoryId }, { categoryName });
            res.status(201).json({ musicCategory: musicCategory, message: "Music Category updated Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getMusicCategoryById = async (req, res) => {
    
    try {

        const musicCategory = await musicCategoryModel.findOne({ _id: req.params.id });

        if (musicCategory) {
            res.status(201).json({ musicCategory: musicCategory, message: "Music Category fetched Successfully" });
        } else {
            throw Error("Cannot find Music Category");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

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

        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let skip = (page - 1) * pageSize;

        const search = req.query.search || '';
        const searchFilter = search ? { title: { $regex: search, $options: 'i' } } : {};

        let count = await musicCategoryModel.countDocuments({
            ...searchFilter,
        });

        const musicCategories = await musicCategoryModel.find({ 
            ...searchFilter,
        })
        .skip(skip)
        .limit(pageSize);

        res.status(201).json({ count, page, pages: Math.ceil(count / pageSize), musicCategories: musicCategories, message: "Music Categories Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.addMusic = [

    body("musicName").not().isEmpty(),
    body("movieId").not().isEmpty(),
    body("categoryId").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { musicName, categoryId, movieId } = req.body;
        const { audio } = req.files;
  
        try {

            const audioRef = ref(storage, `music/${ Date.now() + '.' + audio.name.split('.')[1]} `);
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

            const music = await musicModel.create({ musicName, movieName: movieId, categoryName: categoryId, audioLink });
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
    body("movieId").not().isEmpty(),
    body("categoryId").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
  
        try {

            let audioLink = req.body?.audio;

            if (req.files?.audio) {
                const audioRef = ref(storage, `music/${ Date.now() + '.' + req.files?.audio.name.split('.')[1]} `);
                
                await uploadBytes(audioRef, req.files?.audio.data)
                    .then(snapshot => {
                        return getDownloadURL(snapshot.ref)
                    })
                    .then(downloadURL => {
                        audioLink = downloadURL
                    })
                    .catch(error => {
                        throw Error(error);
                    })
            }

            const music = await musicModel.findOneAndUpdate({ _id: req?.body?.musicId }, { musicName: req?.body?.musicName, audioLink, movieName: req?.body?.movieId, categoryName: req?.body?.categoryId });
            res.status(201).json({ music: music, message: "Music updated Successfully" });
            
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

        const search = req.query.search || '';

        const music = await musicModel.find({  }).populate('movieName').populate('movieName categoryName').lean();

        let musics = []

        for (let i = 0; i < music.length; i++) {

            if (music[i].movieName.movieName.toLowerCase().includes(search.toLowerCase()) || music[i].musicName.toLowerCase().includes(search.toLowerCase())) {

                if (musics.length === 0) {

                    let movie = music[i].movieName
                    delete music[i].movieName
                    movie.music = [music[i]]
                    musics.push(movie)

                } else {

                    let isExist = false
                    let id = 0

                    for (let j = 0; j < musics.length; j++) {
                        if (music[i].movieName.movieName === musics[j].movieName) {
                            isExist = true 
                            id = j
                            break;
                        }
                    }

                    if (isExist) {
                        delete music[i].movieName
                        musics[id].music.push(music[i])
                    } else {
                        let movie = music[i].movieName
                        delete music[i].movieName
                        movie.music = [music[i]]
                        musics.push(movie)
                    }
    
                }

            }

        }

        res.status(201).json({ music: musics, message: "Music Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getAllMusics = async (req, res) => {
    
    try {

        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let skip = (page - 1) * pageSize;

        const search = req.query.search || '';
        const searchFilter = search ? { title: { $regex: search, $options: 'i' } } : {};

        let count = await musicModel.countDocuments({
            ...searchFilter,
        });

        const musics = await musicModel.find({ 
            ...searchFilter
        })
        .populate('categoryName movieName')
        .skip(skip)
        .limit(pageSize);

        res.status(201).json({ count, page, pages: Math.ceil(count / pageSize), musics: musics, message: "Music Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.addMovie = [

    body("movieName").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { movieName } = req.body;
        const { image } = req.files;
  
        try {

            const imageRef = ref(storage, `movie/${ Date.now() + '.' + image.name.split('.')[1]} `);
            let imageLink 
            await uploadBytes(imageRef, image.data)
            .then(snapshot => {
                return getDownloadURL(snapshot.ref)
            })
            .then(downloadURL => {
                imageLink = downloadURL
            })
            .catch(error => {
                throw Error(error);
            })

            const movie = await movieModel.create({ movieName, image: imageLink });
            res.status(201).json({ movie: movie, message: "Movie created Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.updateMovie = [

    body("movieId").not().isEmpty(),
    body("movieName").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
  
        try {

            let imageLink = req.body?.image;

            if (req.files?.image) {
                const imageRef = ref(storage, `movie/${ Date.now() + '.' + req.files?.image.name.split('.')[1]} `);
                
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

            const movie = await movieModel.findOneAndUpdate({ _id: req?.body?.movieId }, { movieName: req?.body?.movieName, image: imageLink });
            res.status(201).json({ movie: movie, message: "Movie updated Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getMovieById = async (req, res) => {
    
    try {

        const movie = await movieModel.findOne({ _id: req.params.id });

        if (movie) {
            res.status(201).json({ movie: movie, message: "Movie Fetched Successfully" });
        } else {
            throw Error("Cannot find Movie");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.deleteMovie = async (req, res) => {
    
    try {

        const movie = await movieModel.findOneAndDelete({ _id: req.params.id });

        if (movie) {
            res.status(201).json({ movie: movie, message: "Movie Deleted Successfully" });
        } else {
            throw Error("Cannot find Movie");
        }
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getAllMovies = async (req, res) => {
    
    try {

        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let skip = (page - 1) * pageSize;

        const search = req.query.search || '';
        const searchFilter = search ? { title: { $regex: search, $options: 'i' } } : {};

        let count = await movieModel.countDocuments({
            ...searchFilter,
        });

        const movies = await movieModel.find({ 
            ...searchFilter,
        })
        .skip(skip)
        .limit(pageSize);

        res.status(201).json({ count, page, pages: Math.ceil(count / pageSize), movies: movies, message: "Movies Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}