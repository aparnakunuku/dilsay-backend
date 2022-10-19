const { Router } = require("express");
const { addInterest, deleteInterest, getAllInterests } = require("../controllers/adminController");

const adminRoutes = Router();

adminRoutes.post("/addInterest", addInterest);
adminRoutes.get("/deleteInterest/:id", deleteInterest);
adminRoutes.get("/getAllInterests", getAllInterests);

module.exports = adminRoutes;