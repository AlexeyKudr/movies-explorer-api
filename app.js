const express = require('express');
const mongoose = require('mongoose');
const { errors: celebrateErrors } = require('celebrate');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const router = require('./routers');
const errors = require('./middlewars/errors');
const { requestLogger, errorLogger } = require('./middlewars/logger');
const NotFoundError = require('./middlewars/NotFoundError');
const limiter = require('./utils/rateLimit');
const cors = require('./middlewars/cors');

const app = express();
app.use(helmet());
const { PORT, MONGO_DB } = process.env;
mongoose.connect(MONGO_DB, ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
}));
app.use(limiter);
app.use(requestLogger);
const options = {
  origin: [
    'https://api.alexeykudr.nomoredomainswork.ru',
    'http://api.alexeykudr.nomoredomainswork.ru',
    'https://alexeykudr.nomoredomainswork.ru',
    'http://alexeykudr.nomoredomainswork.ru',
    'https://api.nomoreparties.co/beatfilm-movies',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3000/users/me',
    'http://localhost:3000/movies',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};
app.use(cors(options));
app.use(express.json());
app.use(cookieParser());
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(router);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errorLogger);
app.use(celebrateErrors());
app.use(errors);
app.listen(PORT, () => {
});
