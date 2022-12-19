const { Router } = require("express");
const { addInterest, deleteInterest, getAllInterests, confirmVerification, updateInterest, getInterestById, getAllUsers, deleteUser } = require("../controllers/adminController");
const { isAuth, isSuperAdmin } = require("../middlewares/verifyToken");

const adminRoutes = Router();

adminRoutes.get("/getAllUsers", isAuth, isSuperAdmin, getAllUsers);
adminRoutes.get("/deleteUser/:id", isAuth, isSuperAdmin, deleteUser);
adminRoutes.post("/addInterest", isAuth, isSuperAdmin, addInterest);
adminRoutes.post("/updateInterest", isAuth, isSuperAdmin, updateInterest);
adminRoutes.get("/getInterestById/:id", isAuth, isSuperAdmin, getInterestById);
adminRoutes.get("/deleteInterest/:id", isAuth, isSuperAdmin, deleteInterest);
adminRoutes.get("/getAllInterests", isAuth, getAllInterests);
adminRoutes.post("/confirmVerification", isAuth, isSuperAdmin, confirmVerification);

module.exports = adminRoutes;