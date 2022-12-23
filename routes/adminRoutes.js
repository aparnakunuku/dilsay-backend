const { Router } = require("express");
const { addInterest, deleteInterest, getAllInterests, updateInterest, getInterestById, getAllUsers, deleteUser, updateVerificationStatus, getPendingVerificationRequest, getVerificationById } = require("../controllers/adminController");
const { isAuth, isSuperAdmin } = require("../middlewares/verifyToken");

const adminRoutes = Router();

adminRoutes.get("/getAllUsers", isAuth, isSuperAdmin, getAllUsers);
adminRoutes.get("/deleteUser/:id", isAuth, isSuperAdmin, deleteUser);
adminRoutes.post("/addInterest", isAuth, isSuperAdmin, addInterest);
adminRoutes.post("/updateInterest", isAuth, isSuperAdmin, updateInterest);
adminRoutes.get("/getInterestById/:id", isAuth, isSuperAdmin, getInterestById);
adminRoutes.get("/deleteInterest/:id", isAuth, isSuperAdmin, deleteInterest);
adminRoutes.get("/getAllInterests", isAuth, getAllInterests);
adminRoutes.post("/updateVerificationStatus", isAuth, isSuperAdmin, updateVerificationStatus);
adminRoutes.get("/getPendingVerificationRequest", isAuth, isSuperAdmin, getPendingVerificationRequest);
adminRoutes.get("/getVerificationById/:id", isAuth, isSuperAdmin, getVerificationById);

module.exports = adminRoutes;