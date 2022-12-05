const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const upload = require('express-fileupload');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const musicRoutes = require('./routes/musicRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/userRoutes');
const inviteRoutes = require('./routes/inviteRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
dotenv.config();

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use(upload());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/music', musicRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/invite', inviteRoutes);
app.use('/api/v1/game', gameRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.CONNECTION_URL || 'mongodb+srv://prishiv:prishiv@cluster0.dsjcurq.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`)))
    .catch( (error) => console.log(error.message));