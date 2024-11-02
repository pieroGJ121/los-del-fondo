const express = require('express');
const response = require('../../network/response');
const contoller = require('./index');
const router = express.Router();

router.get('/', allUsers);
router.get('/:id', oneUser);
router.delete('/', removeUser);
router.post('/', addUser);

async function allUsers (req,res,next) {
    try{
        const items = await contoller.allUsers();
        response.success(req,res,items,200);
    } catch (err) {
        next(err);
    }
};

async function oneUser (req,res,next) {
    try{
        const items = await contoller.oneUser(req.params.id);
        response.success(req,res,items,200);
    } catch (err) {
        next(err);
    }
};

async function removeUser (req,res,next) {
    try{
        const items = await contoller.removeUser(req.body);
        response.success(req,res,'User was removed',200);
    } catch (err) {
        next(err);
    }
};

async function addUser (req,res,next) {
    try{
        const items = await contoller.addUser(req.body);
        if(req.body.id == 0){
            message = 'User was added';
        }else{
            message = 'User was updated';
        }
        response.success(req,res,message,201);
    } catch (err) {
        next(err);
    }
};


module.exports = router;