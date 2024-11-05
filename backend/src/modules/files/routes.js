const express = require('express');
const router = express.Router();
const {addFile} = require('./controller');

router.post('/add', addFile);

module.exports = router;
