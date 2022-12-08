const { Router } = require("express");
const { addInterest, deleteInterest, getAllInterests, confirmVerification, updateInterest, getInterestById } = require("../controllers/adminController");

const adminRoutes = Router();

adminRoutes.post("/addInterest", addInterest);
adminRoutes.post("/updateInterest", updateInterest);
adminRoutes.get("/getInterestById/:id", getInterestById);
adminRoutes.get("/deleteInterest/:id", deleteInterest);
adminRoutes.get("/getAllInterests", getAllInterests);
adminRoutes.post("/confirmVerification", confirmVerification);

module.exports = adminRoutes;