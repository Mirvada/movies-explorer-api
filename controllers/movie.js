const mongoose = require('mongoose');

const Movie = require('../models/movie');
const BadRequest = require('../utils/errors/BadRequestError');
const NotFound = require('../utils/errors/NotFoundError');
const Forbidden = require('../utils/errors/ForbiddenError');
const { BAD_REQUSTER_ERROR_TEXT, NOT_FOUND_ID_ERROR_TEXT, FORBIDDEN_ERROR_TEXT } = require('../utils/errorsMessage');
const { CREATE_STATUS } = require('../utils/statusCode');

const { ValidationError, CastError } = mongoose.Error;

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(CREATE_STATUS).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest(BAD_REQUSTER_ERROR_TEXT));
      } else {
        next(err);
      }
    });
};

const getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFound(NOT_FOUND_ID_ERROR_TEXT))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new Forbidden(FORBIDDEN_ERROR_TEXT));
      }
      return Movie.deleteOne(movie)
        .then(() => res.send(movie));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest(BAD_REQUSTER_ERROR_TEXT));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie,
  getSavedMovies,
  deleteMovie,
};
