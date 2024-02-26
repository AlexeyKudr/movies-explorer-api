const express = require('express');
const userRouter = require('./user');
const movieRouter = require('./movie');
const { login, createUser } = require('../controllers/user');
const auth = require('../middlewars/auth');
const { loginValid, createUserValid } = require('../middlewars/validations');

const router = express.Router();

router.post('/signin', loginValid, login);
router.post('/signup', createUserValid, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

module.exports = router;
