const express = require('express');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const { createMovieValid } = require('../middlewars/validations');

const movieRouter = express.Router();

movieRouter.get('/', getMovies);
movieRouter.post('/', createMovieValid, createMovie);
movieRouter.delete('/:movieId', deleteMovie);

module.exports = movieRouter;
