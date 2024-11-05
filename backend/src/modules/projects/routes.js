const express = require('express');
const router = express.Router();
const {createProject, getUserProjects} = require('./controller');

router.post('/create', createProject);
router.get('/:userId', getUserProjects);

module.exports = router;
