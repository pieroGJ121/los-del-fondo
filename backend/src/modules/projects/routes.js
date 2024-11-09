const express = require('express');
const router = express.Router();
const { 
    createProject, 
    getProject, 
    updateProject, 
    deleteProject, 
    addNestedProject,
    modifyNestedProject,
    removeNestedProject,
    updateProjectSurname,
    updateProjectStatus
} = require('./controller');

router.get('/:userId', getProject); 
router.post('/create', createProject);                       
router.put('/:id', updateProject);                
router.delete('/:id', deleteProject);

router.post('/:parentProjectId/nest-new', addNestedProject); 
router.put('/:parentProjectId/nest-mod/', modifyNestedProject);
router.delete('/:parentProjectId/nest-del/', removeNestedProject); 

router.put('/:id/update-surname', updateProjectSurname);
router.put('/:id/update-status', updateProjectStatus);



module.exports = router;