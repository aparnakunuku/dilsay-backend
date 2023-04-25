const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const upload = require('express-fileupload');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const musicRoutes = require('./routes/musicRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');
const inviteRoutes = require('./routes/inviteRoutes');
const gameRoutes = require('./routes/gameRoutes');
const chatRoutes = require('./routes/chatRoutes');
const connectDB = require('./config/db');
const socket = require('socket.io');
const https = require('https');
const fs = require('fs');

const app = express();
dotenv.config();

connectDB();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use(upload());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/music', musicRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/invite', inviteRoutes);
app.use('/api/v1/game', gameRoutes);
app.use('/api/v1/chat', chatRoutes);

const PORT = process.env.PORT || 3000;

// var cert = fs.readFileSync('./ssl/cert.pem');
// var key = fs.readFileSync('./ssl/privkey.pem');
// var chain = fs.readFileSync('./ssl/chain.pem');

// var sslOptions = { key: key, cert: cert, ca: chain };

// var httpsApp = https.createServer(sslOptions, app);

const server = app.listen(PORT, () =>
    console.log(`Server is running on port: ${PORT}`)
);

const io = socket(server);

io.on('connection', (socket) => {
    console.log('Connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User Joined Room: ' + room);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));

    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', (newMessageRecieved) => {
        socket
            .in(newMessageRecieved.refUser._id)
            .emit('message recieved', newMessageRecieved);
    });

    socket.off('setup', () => {
        console.log('USER DISCONNECTED');
        socket.leave(userData._id);
    });
});
