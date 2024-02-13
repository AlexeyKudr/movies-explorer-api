const express = require('express');
const { updateUser, currentUser } = require('../controllers/user');
const { updateUserValid } = require('../middlewars/validations');

const userRouter = express.Router();

userRouter.get('/me', currentUser);
userRouter.patch('/me', updateUserValid, updateUser);

module.exports = userRouter;
