const { body, validationResult } = require("express-validator");
const gameInfoModel = require("../models/gameInfoModel");
const gameModel = require("../models/gameModel");

module.exports.getAllGameCategories = async (req, res) => {
    
    try {

        const gameCategories = await gameModel.find({  });

        res.status(201).json({ gameCategories: gameCategories, message: "Game Categories Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.addGameCategory = [

    body("category").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { category } = req.body;
  
        try {

            const gameCategory = await gameModel.create({ category, levels: [{ level: 1 }] });

            
            res.status(201).json({ category: gameCategory, message: "Category created Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.deleteGameCategory = async (req, res) => {
    
    try {

        const gameCategory = await gameModel.deleteOne({ _id: req.params.id });

        res.status(201).json({ gameCategory: gameCategory, message: "Game Category Deleted Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.getAllGameLevels = async (req, res) => {
    
    try {

        const gameLevels = await gameModel.find({ _id: req.params.id }).select('levels');

        res.status(201).json({ gameLevels: gameLevels, message: "Game Levels Fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

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

            const game = await gameModel.findOneAndUpdate({ _id: categoryId }, { $addToSet: { levels: { level } } });
            
            res.status(201).json({ level: game, message: "Level created Successfully" });
            
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

module.exports.addQuestions = [

    body("categoryId").not().isEmpty(),
    body("level").not().isEmpty(),
    body("questions").not().isEmpty(),
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { categoryId, level, questions } = req.body;
  
        try {

            const game = await gameModel.findOneAndUpdate({ _id: categoryId, 'levels.level': level }, { 
                '$set': {
                    'levels.$.questions':  questions 
                }
                
            });
            
            res.status(201).json({ game: game, message: "Question added Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

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

            const questions = await gameModel.findOne({ _id: categoryId, 'levels.level': level }, {'levels.$' : 1});
            
            res.status(201).json({ questions: questions, message: "Questions fetched Successfully" });
            
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
  
    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { gameCategory, user1, user2 } = req.body;
  
        try {

            const game = await gameInfoModel.create({ gameCategory, user1, user2 });

            res.status(201).json({ game: game, message: "Game started Successfully" });
            
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

            const game = await gameInfoModel.create({ gameCategory, user1, user2 }, { status });

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

            if (game.tries >= 2) {
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
                    
                    const game = await gameInfoModel.findOneAndUpdate({ gameCategory, $or: [ { user1: user1 }, { user1: user2 } ], $or: [ { user2: user1 }, { user2: user2 } ] }, { answers: [], questions: [], $inc: { gameLevel: 1 }, tries: 0 });
                    res.status(201).json({ game: game, message: "Answered Successfully" });

                } else {
                    const game = await gameInfoModel.findOneAndUpdate({ gameCategory, $or: [ { user1: user1 }, { user1: user2 } ], $or: [ { user2: user1 }, { user2: user2 } ] }, { $inc: { tries: 1 } });
                    res.status(400).json({ game: game, message: "Answers do not match. Please try again!" });
                }

            } else {

                const game = await gameInfoModel.findOneAndUpdate({ gameCategory, $or: [ { user1: user1 }, { user1: user2 } ], $or: [ { user2: user1 }, { user2: user2 } ] }, { answers });
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

                const questions = await gameModel.findOne({ _id: categoryId, 'levels.level': level }, {'levels.$' : 1});

                if (questions?.levels[0]?.questions.length > 5) {

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

                    let selectedQuestions = getRandom(questions?.levels[0]?.questions,5)

                    const game = await gameInfoModel.findOneAndUpdate({ gameCategory: categoryId, $or: [ { user1: user1 }, { user1: user2 } ], $or: [ { user2: user1 }, { user2: user2 } ] }, { questions: selectedQuestions });
                    
                    res.status(201).json({ questions: selectedQuestions, message: "Questions fetched Successfully" });

                } else {

                    res.status(201).json({ questions: questions?.levels[0]?.questions, message: "Questions fetched Successfully" });

                }

            }
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]