const { Router } = require("express");
const { addGameLevel, addGameCategory, getAllGameCategories, getAllGameLevels, deleteGameCategory, deleteGameLevel, getAllQuestions, startGame, answerGame, getGameQuestions, acceptOrRejectGameInvite, updateGameCategory, getGameCategoryById, updateQuestion, addQuestion, getQuestionById, deleteQuestion } = require("../controllers/gameController");
const { isAuth, isSuperAdmin } = require("../middlewares/verifyToken");

const gameRoutes = Router();

gameRoutes.get("/getAllGameCategories", isAuth, getAllGameCategories);
gameRoutes.post("/addGameCategory", isAuth, isSuperAdmin, addGameCategory);
gameRoutes.post("/updateGameCategory", isAuth, isSuperAdmin, updateGameCategory);
gameRoutes.get("/getGameCategoryById/:id", isAuth, isSuperAdmin, getGameCategoryById);
gameRoutes.get("/deleteGameCategory/:id", isAuth, isSuperAdmin, deleteGameCategory);
gameRoutes.get("/getAllGameLevels/:id", isAuth, getAllGameLevels);
gameRoutes.post("/addGameLevel", isAuth, isSuperAdmin, addGameLevel);
gameRoutes.post("/deleteGameLevel", isAuth, deleteGameLevel);
gameRoutes.post("/addQuestion", isAuth, isSuperAdmin, addQuestion);
gameRoutes.post("/updateQuestion", isAuth, isSuperAdmin, updateQuestion);
gameRoutes.get("/getQuestionById/:id", isAuth, isSuperAdmin, getQuestionById);
gameRoutes.get("/deleteQuestion/:id", isAuth, isSuperAdmin, deleteQuestion);
gameRoutes.post("/getAllQuestions", isAuth, getAllQuestions);
gameRoutes.post("/startGame", isAuth, startGame);
gameRoutes.post("/acceptOrRejectGameInvite", isAuth, acceptOrRejectGameInvite);
gameRoutes.post("/answerGame", isAuth, answerGame);
gameRoutes.post("/getGameQuestions", isAuth,getGameQuestions);

module.exports = gameRoutes;