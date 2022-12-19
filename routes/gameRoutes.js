const { Router } = require("express");
const { addGameLevel, addGameCategory, getAllGameCategories, getAllGameLevels, deleteGameCategory, deleteGameLevel, addQuestions, getAllQuestions, startGame, answerGame, getGameQuestions, acceptOrRejectGameInvite } = require("../controllers/gameController");
const { isAuth, isSuperAdmin } = require("../middlewares/verifyToken");

const gameRoutes = Router();

gameRoutes.get("/getAllGameCategories", isAuth, getAllGameCategories);
gameRoutes.post("/addGameCategory", isAuth, isSuperAdmin, addGameCategory);
gameRoutes.get("/deleteGameCategory/:id", isAuth, isSuperAdmin, deleteGameCategory);
gameRoutes.get("/getAllGameLevels/:id", isAuth, getAllGameLevels);
gameRoutes.post("/addGameLevel", isAuth, isSuperAdmin, addGameLevel);
gameRoutes.post("/deleteGameLevel", isAuth, isSuperAdmin, deleteGameLevel);
gameRoutes.post("/addQuestions", isAuth, isSuperAdmin, addQuestions);
gameRoutes.post("/getAllQuestions", isAuth, getAllQuestions);
gameRoutes.post("/startGame", isAuth, startGame);
gameRoutes.post("/acceptOrRejectGameInvite", isAuth, acceptOrRejectGameInvite);
gameRoutes.post("/answerGame", isAuth, answerGame);
gameRoutes.post("/getGameQuestions", isAuth,getGameQuestions);

module.exports = gameRoutes;