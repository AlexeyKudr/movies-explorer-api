const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const { OK, MONGO_DUPLICATE_ERROR_CODE } = require('../utils/const');
const BadRequestError = require('../middlewars/BadRequestError');
const DuplicateError = require('../middlewars/DuplicateError');
const UnAuthorized = require('../middlewars/UnAuthorized');
const NotFoundError = require('../middlewars/NotFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const newUser = await user.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    return res
      .status(201)
      .send({
        email: newUser.email,
        name: newUser.name,
      });
  } catch (error) {
    if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      return next(new DuplicateError('Такой email уже существует'));
    }
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные'));
    }
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const patchUser = await user.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true },
    ).orFail(new NotFoundError('Запрашиваемый пользователь не найден'));
    return res
      .status(OK)
      .json(patchUser);
  } catch (error) {
    if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      return next(new DuplicateError('Такой email уже существует'));
    }
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные'));
    }
    return next(error);
  }
};

// eslint-disable-next-line consistent-return
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const User = await user.findOne({ email }).select('+password');
    if (!User) {
      throw new UnAuthorized('Неверные почта или пароль');
    }
    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      throw new UnAuthorized('Неверные почта или пароль');
    }
    const token = jwt.sign({ _id: User._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    return res
      .status(OK)
      .send({ token });
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const User = await user.findById(userId)
      .orFail(() => next(new NotFoundError('Запрашиваемый пользователь не найден')));
    return res
      .status(200)
      .send({
        name: User.name,
        email: User.email,
      });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser, updateUser, login, currentUser,
};
