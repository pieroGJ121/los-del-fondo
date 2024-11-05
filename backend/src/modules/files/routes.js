const express = require('express');
const router = express.Router();
const {upload, addFile, getFileById, updateFile, deleteFile } = require('./controller');

router.post('/add', upload.single('image'), addFile);                
router.get('/:id', getFileById);             
router.put('/:id', updateFile);             
router.delete('/:id', deleteFile);          

module.exports = router;