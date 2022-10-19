const { Router } = require("express");
const { createSubscription, updateSubscription, getAllSubscriptions, deleteSubscription, getSubscriptionById } = require("../controllers/subscriptionController");
const { isAuth } = require("../middlewares/verifyToken");

const subscriptionRoutes = Router();

subscriptionRoutes.post("/createSubscription", createSubscription);
subscriptionRoutes.post("/updateSubscription", updateSubscription);
subscriptionRoutes.get("/getSubscriptionById/:id", getSubscriptionById);
subscriptionRoutes.get("/deleteSubscription/:id", deleteSubscription);
subscriptionRoutes.get("/getAllSubscriptions", isAuth, getAllSubscriptions);

module.exports = subscriptionRoutes;