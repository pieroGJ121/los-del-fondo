const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const {connectToMongoDB} = require('./DB/mongodb');
const config = require('./config');
const authenticateJWT = require('./middleware/authenticateJWT');

const users = require('./modules/users/routes');
const projects = require('./modules/projects/routes');
const files = require('./modules/files/routes');
const error = require('./network/errors');

const app = express();
app.use(cors());
app.use(helmet());

// MongoDB Connection
connectToMongoDB();

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//configuration
app.set('port', config.app.port);

// Rate Limit
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 25,
    message: 'Too many login attempts, please try again later'
});

//routes
app.use('/api/users', loginLimiter, users);
app.use('/api/projects', authenticateJWT, projects);
app.use('/api/files', authenticateJWT, files);
app.use(error);

module.exports = app;