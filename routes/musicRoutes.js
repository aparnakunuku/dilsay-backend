const { Router } = require("express");
const { addMusicCategory, deleteMusicCategory, getAllMusicCategories, addMusic, deleteMusic, getAllMusic, getMusicById, updateMusic } = require("../controllers/musicController");

const musicRoutes = Router();

musicRoutes.post("/addMusicCategory", addMusicCategory);
musicRoutes.get("/deleteMusicCategory/:id", deleteMusicCategory);
musicRoutes.get("/getAllMusicCategories", getAllMusicCategories);
musicRoutes.post("/addMusic", addMusic);
musicRoutes.post("/updateMusic", updateMusic);
musicRoutes.get("/getMusicById/:id", getMusicById);
musicRoutes.get("/deleteMusic/:id", deleteMusic);
musicRoutes.get("/getAllMusic", getAllMusic);

module.exports = musicRoutes;