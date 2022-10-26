const { Router } = require("express");
const { addInterest, deleteInterest, getAllInterests, confirmVerification } = require("../controllers/adminController");

const adminRoutes = Router();

adminRoutes.post("/addInterest", addInterest);
adminRoutes.get("/deleteInterest/:id", deleteInterest);
adminRoutes.get("/getAllInterests", getAllInterests);
adminRoutes.post("/confirmVerification", confirmVerification);

module.exports = adminRoutes;