const { CastError } = require('mongoose').Error;
const movie = require('../models/movies');
const { OK } = require('../utils/const');
const BadRequestError = require('../middlewars/BadRequestError');
const NotFoundError = require('../middlewars/NotFoundError');
const ForbiddenError = require('../middlewars/ForbiddenError');

const getMovies = async (req, res, next) => {
  try {
    const allMovie = await movie.find({ owner: req.user._id });
    res
      .status(OK)
      .send(allMovie);
  } catch (error) {
    next(error);
  }
};

const createMovie = async (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;
  try {
    const newMovie = await movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    });
    return res.status(OK).send({ newMovie });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError(error.message));
    }
    return next(error);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const Movie = await movie.findById(movieId)
      .orFail(() => next(new NotFoundError('Фильм не найден')));
    if (Movie.owner.toString() !== req.user._id) {
      return next(new ForbiddenError('Недостаточно прав для удаления'));
    }
    await Movie.deleteOne({ _id: movieId });
    return res
      .status(OK)
      .send({ message: 'Фильм успешно удален' });
  } catch (error) {
    if (error instanceof CastError) {
      return next(new BadRequestError('Некорректный ID фильма'));
    }
    return next(error);
  }
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
