const { Router } = require("express");
const { getMyProfile, editProfile, updateUserLocation, changeOnlineStatus, verifyProfile, deleteMyAccount, blockUser, rejectUser, buySubscription, showAllProfiles, addToViewedProfiles, getAllNotifications, likeImage, loveImage, updatePreferences, getPrefernces } = require("../controllers/userController");
const { isAuth } = require("../middlewares/verifyToken");

const userRoutes = Router();

userRoutes.get("/showAllProfiles", isAuth, showAllProfiles);
userRoutes.get("/getMyProfile", isAuth, getMyProfile);
userRoutes.post("/editProfile", isAuth, editProfile);
userRoutes.post("/updateUserLocation", isAuth, updateUserLocation);
userRoutes.post("/changeOnlineStatus", isAuth, changeOnlineStatus);
userRoutes.post("/verifyProfile", isAuth, verifyProfile);
userRoutes.get("/deleteMyAccount", isAuth, deleteMyAccount);
userRoutes.post("/blockUser", isAuth, blockUser);
userRoutes.post("/rejectUser", isAuth, rejectUser);
userRoutes.post("/buySubscription", isAuth, buySubscription);
userRoutes.post("/addToViewedProfiles", isAuth, addToViewedProfiles);
userRoutes.get("/getAllNotifications", isAuth, getAllNotifications);
userRoutes.get("/likeImage/:userId/:id", isAuth, likeImage);
userRoutes.get("/loveImage/:userId/:id", isAuth, loveImage);
userRoutes.post("/updatePrefernces", isAuth, updatePreferences);
userRoutes.get("/getPrefernces", isAuth, getPrefernces);

module.exports = userRoutes;