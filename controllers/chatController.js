const { body, validationResult } = require("express-validator");
const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("../config/firebase");

module.exports.accessChat = [

    body("userId").not().isEmpty(),

    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { userId } = req.body;
  
        try {

            let isChat = await chatModel.findOne({
                $and: [
                  { users: { $elemMatch: { $eq: req.user._id } } },
                  { users: { $elemMatch: { $eq: userId } } },
                ],
            })
            .populate("users", "-password")
            .populate("latestMessage");

            isChat = await userModel.populate(isChat, {
                path: "latestMessage.sender"
            });
            
            if (isChat) {

                res.status(201).json({ chat: isChat, message: "Successfully Fetched chat" });

            } else {

                const createdChat = await chatModel.create({ users: [req.user._id, userId] });

                const chat = await chatModel.findOne({ _id: createdChat._id }).populate("users", "-password");

                res.status(201).json({ chat: chat, message: "Successfully Fetched chat" });
                
            }
        
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.fetchAllChats = async (req, res) => {
    
    try {

        let chats = chatModel.find({ 
            users: { $elemMatch: { $eq: req.user._id } } 
        })
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })

        chats = await userModel.populate(chats, {
            path: "latestMessage.sender",
            select: "-password",
        });
      

        res.status(201).json({ chats: chats, message: "All chats fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}

module.exports.sendMessage = [

    body("chatId").not().isEmpty(),
    body("type").not().isEmpty(),

    async (req, res) => {
  
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { chatId, refMessage, type } = req.body;
  
        try {

            let mes = req.body?.body;

            if (req.files?.media) {
                const mediaRef = ref(storage, `chat-media/${ Date.now() + '.' + req.files?.media.name.split('.')[1]} `);
                
                await uploadBytes(mediaRef, req.files?.media.data)
                    .then(snapshot => {
                        return getDownloadURL(snapshot.ref)
                    })
                    .then(downloadURL => {
                        mes = downloadURL
                    })
                    .catch(error => {
                        throw Error(error);
                    })
            }

            const createdMessage = await messageModel.create({ chat: chatId, body: mes, sender: req.user._id, refMessage, type });

            let message = await messageModel.findOne({ _id: createdMessage._id })
            .populate("chat")
            .populate("sender", "-password")

            message = await userModel.populate(message, {
                path: "chat.users",
                select: "-password",
            });
            
            await chatModel.findByIdAndUpdate(chatId, { latestMessage: message._id });

            res.status(201).json({ sentMessage: message, message: "Message sent Successfully" });
            
        }
    
        catch (err) {
    
            let error = err.message;
            res.status(400).json({ error: error });
    
        }
  
    }
  
]

module.exports.fetchAllMessages = async (req, res) => {
    
    try {

        const disappearTime = req.query.disappearTime || 0;
        const date = new Date()
        date.setMinutes(date.getMinutes() - disappearTime);
        const disappearTimeFilter = { createdAt: { $gte: date } };

        const messages = await messageModel.find({ 
            ...disappearTimeFilter,
            chat: req.params.id 
        })
        .populate("sender", "-password")
        .populate("chat")
      
        res.status(201).json({ messages: messages, message: "All chats fetched Successfully" });
        
    }

    catch (err) {

        let error = err.message;
        res.status(400).json({ error: error });

    }

}