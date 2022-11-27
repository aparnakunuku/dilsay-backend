const { Router } = require("express");
const { sendInvite, getAllInvitesSent, getAllInvitesRecieved, getAllMatches } = require("../controllers/inviteController");
const { isAuth } = require("../middlewares/verifyToken");

const inviteRoutes = Router();

inviteRoutes.post("/sendInvite", isAuth, sendInvite);
inviteRoutes.get("/getAllInvitesSent", isAuth, getAllInvitesSent);
inviteRoutes.get("/getAllInvitesRecieved", isAuth, getAllInvitesRecieved);
inviteRoutes.get("/getAllMatches", isAuth, getAllMatches);
inviteRoutes.post("/acceptOrRejectInvite", isAuth, sendInvite);

module.exports = inviteRoutes;