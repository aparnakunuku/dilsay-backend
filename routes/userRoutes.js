const { Router } = require("express");
const { getMyProfile, editProfile, updateUserLocation, changeOnlineStatus, verifyProfile, deleteMyAccount, blockUser, rejectUser, buySubscription } = require("../controllers/userController");
const { isAuth } = require("../middlewares/verifyToken");

const userRoutes = Router();

userRoutes.get("/getMyProfile", isAuth, getMyProfile);
userRoutes.post("/editProfile", isAuth, editProfile);
userRoutes.post("/updateUserLocation", isAuth, updateUserLocation);
userRoutes.post("/changeOnlineStatus", isAuth, changeOnlineStatus);
userRoutes.post("/verifyProfile", isAuth, verifyProfile);
userRoutes.get("/deleteMyAccount", isAuth, deleteMyAccount);
userRoutes.post("/blockUser", isAuth, blockUser);
userRoutes.post("/rejectUser", isAuth, rejectUser);
userRoutes.post("/buySubscription", isAuth, buySubscription);

module.exports = userRoutes;