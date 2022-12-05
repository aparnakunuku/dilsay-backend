const { Router } = require("express");
const { addGameLevel, addGameCategory, getAllGameCategories, getAllGameLevels, deleteGameCategory, deleteGameLevel, addQuestions, getAllQuestions, startGame, answerGame, getGameQuestions } = require("../controllers/gameController");
const { isAuth } = require("../middlewares/verifyToken");

const gameRoutes = Router();

gameRoutes.get("/getAllGameCategories", getAllGameCategories);
gameRoutes.post("/addGameCategory", addGameCategory);
gameRoutes.get("/deleteGameCategory/:id", deleteGameCategory);
gameRoutes.get("/getAllGameLevels/:id", getAllGameLevels);
gameRoutes.post("/addGameLevel", addGameLevel);
gameRoutes.post("/deleteGameLevel", deleteGameLevel);
gameRoutes.post("/addQuestions", addQuestions);
gameRoutes.post("/getAllQuestions", getAllQuestions);
gameRoutes.post("/startGame", isAuth, startGame);
gameRoutes.post("/answerGame", isAuth, answerGame);
gameRoutes.post("/getGameQuestions", isAuth,getGameQuestions);

module.exports = gameRoutes;