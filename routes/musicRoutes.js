const { Router } = require("express");
const { addMusicCategory, deleteMusicCategory, getAllMusicCategories, addMusic, deleteMusic, getAllMusic, getMusicById, updateMusic, updateMusicCategory, getMusicCategoryById, addMovie, updateMovie, getMovieById, deleteMovie, getAllMovies } = require("../controllers/musicController");
const { isAuth } = require("../middlewares/verifyToken");

const musicRoutes = Router();

musicRoutes.post("/addMusicCategory", addMusicCategory);
musicRoutes.post("/updateMusicCategory", updateMusicCategory);
musicRoutes.get("/getMusicCategoryById/:id", getMusicCategoryById);
musicRoutes.get("/deleteMusicCategory/:id", deleteMusicCategory);
musicRoutes.get("/getAllMusicCategories", getAllMusicCategories);
musicRoutes.post("/addMusic", addMusic);
musicRoutes.post("/updateMusic", updateMusic);
musicRoutes.get("/getMusicById/:id", getMusicById);
musicRoutes.get("/deleteMusic/:id", deleteMusic);
musicRoutes.get("/getAllMusic", isAuth, getAllMusic);
musicRoutes.post("/addMovie", addMovie);
musicRoutes.post("/updateMovie", updateMovie);
musicRoutes.get("/getMovieById/:id", getMovieById);
musicRoutes.get("/deleteMovie/:id", deleteMovie);
musicRoutes.get("/getAllMovies", getAllMovies);

module.exports = musicRoutes;