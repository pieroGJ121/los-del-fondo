const express = require('express');
const router = express.Router();
const { createProject, getUserProjects, updateProject, deleteProject } = require('./controller');

router.post('/create', createProject);             
router.get('/:userId', getUserProjects);            
router.put('/:id', updateProject);                
router.delete('/:id', deleteProject);              

module.exports = router;

