const { Router } = require("express");
const { addMusicCategory, deleteMusicCategory, getAllMusicCategories, addMusic, deleteMusic, getAllMusic, getMusicById, updateMusic } = require("../controllers/musicController");
const { isAuth } = require("../middlewares/verifyToken");

const musicRoutes = Router();

musicRoutes.post("/addMusicCategory", addMusicCategory);
musicRoutes.get("/deleteMusicCategory/:id", deleteMusicCategory);
musicRoutes.get("/getAllMusicCategories", getAllMusicCategories);
musicRoutes.post("/addMusic", addMusic);
musicRoutes.post("/updateMusic", updateMusic);
musicRoutes.get("/getMusicById/:id", getMusicById);
musicRoutes.get("/deleteMusic/:id", deleteMusic);
musicRoutes.get("/getAllMusic", isAuth, getAllMusic);

module.exports = musicRoutes;