const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const {connectToMongoDB} = require('./DB/mongodb');
const config = require('./config');

const users = require('./modules/users/routes');
const projectRoutes = require('./modules/projects/routes');
const fileRoutes = require('./modules/files/routes');
const error = require('./network/errors');

const app = express();
app.use(cors());

// MongoDB Connection
connectToMongoDB();

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//configuration
app.set('port', config.app.port);

//routes
app.use('/api/users',users);
app.use('/api/projects', projectRoutes);
app.use('/api/files', fileRoutes);
app.use(error);

module.exports = app;