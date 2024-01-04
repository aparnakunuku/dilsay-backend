const { body, validationResult } = require("express-validator");
const gameInfoModel = require("../models/gameInfoModel");
const gameModel = require("../models/gameModel");
const notificationModel = require("../models/notificationModel");
const questionModel = require("../models/questionModel");
const userModel = require("../models/userModel");
const axios = require("axios");

module.exports.getAllGameCategories = async (req, res) => {
    
    try {

        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let skip = (page - 1) * pageSize;

        const search = req.query.search || '';
        const searchFilter = search ? { category: { $regex: search, $options: 'i' } } : {};

        let count = await gameModel.countDocuments({
            ...searchFilter,
        });

        const gameCategories = await gameModel.find({ 
            ...searchFilter,
        })
        .skip(skip)
        .limit(pageSize);

        res.status(201).json({ count, page, pages: Math.ceil(count / pageSize), gameCategories: gameCategories, message: "Game Categories Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.addGameCategory = [

    body("category").not().isEmpty(),
    body("isFree").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { category, isFree } = req.body;
  
        try {

            const gameCategory = await gameModel.create({ category, isFree, levels: [{ level: 1 }] });

            
            res.status(201).json({ category: gameCategory, message: "Category created Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.updateGameCategory = [

    body("categoryId").not().isEmpty(),
    body("category").not().isEmpty(),
    body("isFree").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { categoryId, category, isFree } = req.body;
  
        try {

            const gameCategory = await gameModel.findOneAndUpdate({ _id: categoryId }, { category, isFree });

            
            res.status(201).json({ category: gameCategory, message: "Category updated Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getGameCategoryById = async (req, res) => {
    
    try {

        const gameCategory = await gameModel.findOne({ _id: req.params.id });

        res.status(201).json({ gameCategory: gameCategory, message: "Game Category Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.deleteGameCategory = async (req, res) => {
    
    try {

        const gameCategory = await gameModel.findOneAndDelete({ _id: req.params.id });

        res.status(201).json({ gameCategory: gameCategory, message: "Game Category Deleted Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getAllGameLevels = async (req, res) => {
    
    try {

        let page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let skip = (page - 1) * pageSize;

        let count = await gameModel.countDocuments({});

        const gameLevels = await gameModel.find({ 
            _id: req.params.id 
        })
        .select('levels')
        .skip(skip)
        .limit(pageSize);

        res.status(201).json({ count, page, pages: Math.ceil(count / pageSize), gameLevels: gameLevels, message: "Game Levels Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getAllGameLevelsForUser = [

    body("gameCategory").not().isEmpty(),
    body("user1").not().isEmpty(),
    body("user2").not().isEmpty(),
    
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { gameCategory, user1, user2 } = req.body;
    
        try {

            const gameLevels = await gameModel.find({ 
                _id: gameCategory 
            })
            .select('levels')

            const game = await gameInfoModel.findOne({ gameCategory, $or: [ { user1: user1 }, { user2: user1 } ], $or: [ { user1: user2 }, { user2: user2 } ] });

            let currentLevel = 1;

            if (game) {
                currentLevel = game.gameLevel
            }
            res.status(201).json({ game: game, gameLevels: gameLevels, currentLevel, message: "Game Levels Fetched Successfully" });
            
        }

        catch (err) {

            let error = err.message;
            res.status(400).json({ error: error });

        }

    }
]

module.exports.addGameLevel = [

    body("categoryId").not().isEmpty(),
    body("level").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { categoryId, level } = req.body;
  
        try {

            const exist = await gameModel.findOne({ _id: categoryId, 'levels.level': level });

            if (exist === null) {

                const game = await gameModel.findOneAndUpdate({ _id: categoryId }, { $addToSet: { levels: { level } } });
            
                res.status(201).json({ level: game, message: "Level created Successfully" });
                
            } else {
                res.status(400).json({ message: "Level already exist" });
            }
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.deleteGameLevel = [

    body("categoryId").not().isEmpty(),
    body("level").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { categoryId, level } = req.body;
  
        try {

            const deletedLevel = await gameModel.findOneAndUpdate({ _id: categoryId }, { $pull: { levels: { level: level } } });
            
            res.status(201).json({ level: deletedLevel, message: "Level deleted Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.addQuestion = [

    body("categoryId").not().isEmpty(),
    body("level").not().isEmpty(),
    body("question").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { categoryId, level, question, image } = req.body;
  
        try {

            const q = await questionModel.create({ gameCategory: categoryId, level, question, image });
            
            res.status(201).json({ question: q, message: "Question added Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.updateQuestion = [

    body("categoryId").not().isEmpty(),
    body("level").not().isEmpty(),
    body("question").not().isEmpty(),
    body("questionId").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { questionId, categoryId, level, question, image } = req.body;
  
        try {

            const q = await questionModel.findOneAndUpdate({ _id: questionId }, { gameCategory: categoryId, level, question, image });
            
            res.status(201).json({ question: q, message: "Question updated Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getQuestionById = async (req, res) => {
    
    try {

        const question = await questionModel.findOne({ _id: req.params.id });

        res.status(201).json({ question: question, message: "Question Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.deleteQuestion = async (req, res) => {
    
    try {

        const question = await questionModel.findOneAndDelete({ _id: req.params.id });

        res.status(201).json({ question: question, message: "Question Deleted Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getAllQuestions = [

    body("categoryId").not().isEmpty(),
    body("level").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { categoryId, level } = req.body;
  
        try {

            let page = parseInt(req.query.page) || 1;
            let pageSize = parseInt(req.query.pageSize) || 10;
            let skip = (page - 1) * pageSize;

            const search = req.query.search || '';
            const searchFilter = search ? { question: { $regex: search, $options: 'i' } } : {};

            let count = await questionModel.countDocuments({
                ...searchFilter,
                gameCategory: categoryId, 
                level 
            });

            const questions = await questionModel.find({ 
                ...searchFilter,
                gameCategory: categoryId, 
                level 
            })
            .skip(skip)
            .limit(pageSize);

            res.status(201).json({ count, page, pages: Math.ceil(count / pageSize), questions: questions, message: "Questions fetched Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.startGame = [

    body("gameCategory").not().isEmpty(),
    body("user1").not().isEmpty(),
    body("user2").not().isEmpty(),
    body("status").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { gameCategory, user1, user2, status } = req.body;
  
        try {

            const game = await gameInfoModel.create({ gameCategory, user1, user2, status });

            let user = user1 === req.user._id ? user2 : user1
            const notification = await notificationModel.create({ user, refUser: req.user._id, body: `${req.user.name} requested for game category change.` })

            let u = await userModel.findOne({ _id: refUser })

            let headers = { 
                'Authorization': 'key=AAAAIkbj4C4:APA91bFY3e4nCIaodc-18ruDbz6uu_NEz2pFCSnzkcj9-GV2V802y2Q6kDmsQwh46yaD8c1Cq1CNExpzPydbOJtnHB3icgHf5SHzjkeCRetQWR_lAsBhYi3FMu2S60xajIDWJv9igsJ6', 
                'Content-Type': 'application/json'
            }

            let payload = {
                "registration_ids": [u.fcmToken],
                "notification": {
                    "body": `${req.user.name} requested for game category change.`,
                    "title": "Game category requested",
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


            res.status(201).json({ game: game, message: "Game started Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.checkGameRequest = [

    body("gameCategory").not().isEmpty(),
    body("userId").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { gameCategory, userId } = req.body;
  
        try {

            const game = await gameInfoModel.findOne({ gameCategory, $and: [ { user1: userId }, { user2: req.user._id } ] });
          
            res.status(201).json({ game: game, message: "Game request Successfull" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.acceptOrRejectGameInvite = [

    body("gameCategory").not().isEmpty(),
    body("user1").not().isEmpty(),
    body("user2").not().isEmpty(),
    body("status").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { gameCategory, user1, user2, status } = req.body;
  
        try {

            const game = await gameInfoModel.findOneAndUpdate({ gameCategory, $or: [ { user1: user1 }, { user2: user1 } ], $or: [ { user1: user2 }, { user2: user2 } ] }, { status }, { new: true });
            
            let user = user1 === req.user._id ? user2 : user1
            const notification = await notificationModel.create({ user, refUser: req.user._id, body: `${req.user.name} ${status} request for game category change.` })

            let u = await userModel.findOne({ _id: refUser })

            let headers = { 
                'Authorization': 'key=AAAAIkbj4C4:APA91bFY3e4nCIaodc-18ruDbz6uu_NEz2pFCSnzkcj9-GV2V802y2Q6kDmsQwh46yaD8c1Cq1CNExpzPydbOJtnHB3icgHf5SHzjkeCRetQWR_lAsBhYi3FMu2S60xajIDWJv9igsJ6', 
                'Content-Type': 'application/json'
            }

            let payload = {
                "registration_ids": [u.fcmToken],
                "notification": {
                    "body": `${req.user.name} ${status} request for game category change.`,
                    "title": "Game category requested",
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


            res.status(201).json({ game: game, message: "Game started Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.answerGame = [

    body("gameCategory").not().isEmpty(),
    body("user1").not().isEmpty(),
    body("user2").not().isEmpty(),
    body("answers").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { gameCategory, user1, user2, answers } = req.body;
  
        try {

            const game = await gameInfoModel.findOne({ gameCategory, $or: [ { user1: user1 }, { user1: user2 } ], $or: [ { user2: user1 }, { user2: user2 } ] });

            if (!game) {
                res.status(400).json({ message: "Game doesnt exist!" });
            }
            else if (game.tries >= 2) {
                res.status(400).json({ message: "Max tries exceeded" });
            }
            else if (game.answers && game.answers.length > 0 ) {

                let score = 0

                for (let i = 0; i < game.answers.length; i++) {
                    for (let j = 0; j < answers.length; j++) {
                        if (game.answers[i].question === answers[j].question && game.answers[i].answer === answers[j].answer) {
                            score += 1
                        }
                    }
                }
                
                if (score >= 4) {
                    
                    const game = await gameInfoModel.findOneAndUpdate({ gameCategory, $or: [ { user1: user1 }, { user1: user2 } ], $or: [ { user2: user1 }, { user2: user2 } ] }, { answers: [], questions: [], gameAnsweredBy: [], $inc: { gameLevel: 1 }, tries: 0, bothUserAnsweredGame: null, gameAnswersMatched: null }, { new: true });
                    let user = user1 === req.user._id ? user2 : user1
                    const notification = await notificationModel.create({ user, refUser: req.user._id, body: `${req.user.name} answered the game questions.` })

                    let u = await userModel.findOne({ _id: refUser })

                    let headers = { 
                        'Authorization': 'key=AAAAIkbj4C4:APA91bFY3e4nCIaodc-18ruDbz6uu_NEz2pFCSnzkcj9-GV2V802y2Q6kDmsQwh46yaD8c1Cq1CNExpzPydbOJtnHB3icgHf5SHzjkeCRetQWR_lAsBhYi3FMu2S60xajIDWJv9igsJ6', 
                        'Content-Type': 'application/json'
                    }
    
                    let payload = {
                        "registration_ids": [u.fcmToken],
                        "notification": {
                            "body": `${req.user.name} answered the game questions.`,
                            "title": "Game questions answered",
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

                    res.status(201).json({ game: game, message: "Answered Successfully" });

                } else {
                    const game = await gameInfoModel.findOneAndUpdate({ 
                        gameCategory, 
                        $or: [ { user1: user1 }, { user1: user2 } ], 
                        $or: [ { user2: user1 }, { user2: user2 } ] 
                    }, 
                    { 
                        $inc: { tries: 1 }, 
                        answers: [], 
                        questions: [], 
                        gameAnsweredBy: [],
                        gameAnswersMatched: false, 
                        bothUserAnsweredGame: null 
                    }, { new: true });
                    let user = user1 === req.user._id ? user2 : user1
                    const notification = await notificationModel.create({ user, refUser: req.user._id, body: `${req.user.name} answered the game questions.` })

                    let u = await userModel.findOne({ _id: refUser })

                    let headers = { 
                        'Authorization': 'key=AAAAIkbj4C4:APA91bFY3e4nCIaodc-18ruDbz6uu_NEz2pFCSnzkcj9-GV2V802y2Q6kDmsQwh46yaD8c1Cq1CNExpzPydbOJtnHB3icgHf5SHzjkeCRetQWR_lAsBhYi3FMu2S60xajIDWJv9igsJ6', 
                        'Content-Type': 'application/json'
                    }
    
                    let payload = {
                        "registration_ids": [u.fcmToken],
                        "notification": {
                            "body": `${req.user.name} answered the game questions.`,
                            "title": "Game questions answered",
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
    

                    res.status(400).json({ game: game, message: "Answers do not match. Please try again!" });
                }

            } else {

                const game = await gameInfoModel.findOneAndUpdate({ gameCategory, $or: [ { user1: user1 }, { user1: user2 } ], $or: [ { user2: user1 }, { user2: user2 } ] }, { gameAnsweredBy: [user1], answers, bothUserAnsweredGame: false, gameAnswersMatched: false }, { new: true });
                let user = user1 === req.user._id ? user2 : user1
                const notification = await notificationModel.create({ user, refUser: req.user._id, body: `${req.user.name} answered the game questions.` })

                let u = await userModel.findOne({ _id: refUser })

                let headers = { 
                    'Authorization': 'key=AAAAIkbj4C4:APA91bFY3e4nCIaodc-18ruDbz6uu_NEz2pFCSnzkcj9-GV2V802y2Q6kDmsQwh46yaD8c1Cq1CNExpzPydbOJtnHB3icgHf5SHzjkeCRetQWR_lAsBhYi3FMu2S60xajIDWJv9igsJ6', 
                    'Content-Type': 'application/json'
                }

                let payload = {
                    "registration_ids": [u.fcmToken],
                    "notification": {
                        "body": `${req.user.name} answered the game questions.`,
                        "title": "Game question answered",
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


                res.status(201).json({ game: game, message: "Answered Successfully" });
            
            }
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.getGameQuestions = [

    body("categoryId").not().isEmpty(),
    body("level").not().isEmpty(),
    body("user1").not().isEmpty(),
    body("user2").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { categoryId, level, user1, user2 } = req.body;
  
        try {

            const game = await gameInfoModel.findOne({ gameCategory: categoryId, $or: [ { user1: user1 }, { user1: user2 } ], $or: [ { user2: user1 }, { user2: user2 } ] });

            if (game.questions && game.questions.length > 0) {
                
                res.status(201).json({ questions: game.questions, message: "Questions fetched Successfully" });
            
            } else {

                const questions = await questionModel.find({ gameCategory: categoryId, level });
                if (questions.length > 5) {

                    function getRandom(arr, n) {
                        var result = new Array(n),
                            len = arr.length,
                            taken = new Array(len);
                        if (n > len)
                            throw new RangeError("getRandom: more elements taken than available");
                        while (n--) {
                            var x = Math.floor(Math.random() * len);
                            result[n] = arr[x in taken ? taken[x] : x];
                            taken[x] = --len in taken ? taken[len] : len;
                        }
                        return result;
                    }

                    let selectedQuestions = getRandom(questions,5)

                    const game = await gameInfoModel.findOneAndUpdate({ gameCategory: categoryId, $or: [ { user1: user1 }, { user1: user2 } ], $or: [ { user2: user1 }, { user2: user2 } ] }, { questions: selectedQuestions });
                    
                    res.status(201).json({ questions: selectedQuestions, message: "Questions fetched Successfully" });

                } else {

                    const game = await gameInfoModel.findOneAndUpdate({ gameCategory: categoryId, $or: [ { user1: user1 }, { user1: user2 } ], $or: [ { user2: user1 }, { user2: user2 } ] }, { questions: questions });
                    
                    res.status(201).json({ questions: questions, message: "Questions fetched Successfully" });

                }

            }
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]