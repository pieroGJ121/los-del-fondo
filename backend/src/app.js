const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const users = require('./modules/users/routes');
const error = require('./network/errors');
const app = express();
app.use(cors());

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//configuration
app.set('port', config.app.port);

//routes
app.use('/api/users',users)
app.use(error);

module.exports = app;