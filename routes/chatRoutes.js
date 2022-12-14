const { Router } = require("express");
const { sendMessage, accessChat, fetchAllChats, fetchAllMessages } = require("../controllers/chatController");
const { isAuth } = require("../middlewares/verifyToken");

const chatRoutes = Router();

chatRoutes.post("/accessChat", isAuth,accessChat);
chatRoutes.get("/fetchAllChats", isAuth, fetchAllChats);
chatRoutes.post("/sendMessage", isAuth, sendMessage);
chatRoutes.get("/fetchAllMessages/:id", isAuth, fetchAllMessages);

module.exports = chatRoutes;