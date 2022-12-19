const { Router } = require("express");
const { addMusicCategory, deleteMusicCategory, getAllMusicCategories, addMusic, deleteMusic, getAllMusic, getMusicById, updateMusic, updateMusicCategory, getMusicCategoryById, addMovie, updateMovie, getMovieById, deleteMovie, getAllMovies, getAllMusics } = require("../controllers/musicController");
const { isAuth, isSuperAdmin } = require("../middlewares/verifyToken");

const musicRoutes = Router();

musicRoutes.post("/addMusicCategory", isAuth, isSuperAdmin, addMusicCategory);
musicRoutes.post("/updateMusicCategory", isAuth, isSuperAdmin, updateMusicCategory);
musicRoutes.get("/getMusicCategoryById/:id", isAuth, getMusicCategoryById);
musicRoutes.get("/deleteMusicCategory/:id", isAuth, isSuperAdmin, deleteMusicCategory);
musicRoutes.get("/getAllMusicCategories", getAllMusicCategories);
musicRoutes.post("/addMusic", isAuth, isSuperAdmin, addMusic);
musicRoutes.post("/updateMusic", isAuth, isSuperAdmin, updateMusic);
musicRoutes.get("/getMusicById/:id", isAuth, getMusicById);
musicRoutes.get("/deleteMusic/:id", isAuth, isSuperAdmin, deleteMusic);
musicRoutes.get("/getAllMusic", isAuth, isAuth, getAllMusic);
musicRoutes.get("/getAllMusics", isAuth, isAuth, isSuperAdmin, getAllMusics);
musicRoutes.post("/addMovie", isAuth, isSuperAdmin, addMovie);
musicRoutes.post("/updateMovie", isAuth, isSuperAdmin, updateMovie);
musicRoutes.get("/getMovieById/:id", isAuth, isSuperAdmin, getMovieById);
musicRoutes.get("/deleteMovie/:id", isAuth, isSuperAdmin, deleteMovie);
musicRoutes.get("/getAllMovies", isAuth, getAllMovies);

module.exports = musicRoutes;