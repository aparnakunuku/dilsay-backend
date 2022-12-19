const { Router } = require("express");
const { createSubscription, updateSubscription, getAllSubscriptions, deleteSubscription, getSubscriptionById } = require("../controllers/subscriptionController");
const { isAuth, isSuperAdmin } = require("../middlewares/verifyToken");

const subscriptionRoutes = Router();

subscriptionRoutes.post("/createSubscription", isAuth, isSuperAdmin, createSubscription);
subscriptionRoutes.post("/updateSubscription", isAuth, isSuperAdmin, updateSubscription);
subscriptionRoutes.get("/getSubscriptionById/:id", isAuth, isSuperAdmin, getSubscriptionById);
subscriptionRoutes.get("/deleteSubscription/:id", isAuth, isSuperAdmin, deleteSubscription);
subscriptionRoutes.get("/getAllSubscriptions", isAuth, getAllSubscriptions);

module.exports = subscriptionRoutes;