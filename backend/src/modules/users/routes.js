const express = require('express');
const response = require('../../network/response');
const controller = require('./index');

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
router.get('/', asyncHandler(async (req, res) => {
    const items = await controller.allUsers();
    response.success(req, res, items, 200);
}));
router.get('/:id', asyncHandler(async (req, res) => {
    const items = await controller.oneUser(req.params.id);
    response.success(req, res, items, 200);
}));
router.delete('/', asyncHandler(async (req, res) => {
    await controller.removeUser(req.body);
    response.success(req, res, 'User was removed', 200);
}));
router.post('/', asyncHandler(async (req, res) => {
    const items = await controller.addUser(req.body);
    const message = req.body.id ? 'User was updated' : 'User was added';
    response.success(req, res, items, 201);
}));
router.post('/login', asyncHandler(async (req, res) => {
    const items = await controller.loginUser(req.body);
    response.success(req, res, items, 200);
}));
router.post('/verify-email', asyncHandler(async (req, res) => {
    const exists = await controller.checkEmailExists(req.body.email);
    if (exists) {
        response.success(req, res, 'Email exists. You will receive an email confirmation.', 200);
    } else {
        response.error(req, res, 'No account found with that email.', 404);
    }
}));


module.exports = router;
