const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { CastError, ValidationError } = mongoose.Error;

const User = require('../models/user');
const NotFound = require('../utils/errors/NotFoundError');
const BadRequest = require('../utils/errors/BadRequestError');
const Conflict = require('../utils/errors/ConflictError');
const { BAD_REQUSTER_ERROR_TEXT, CONFLICT_ERROR_TEXT, NOT_FOUND_ID_ERROR_TEXT } = require('../utils/errorsMessage');
const { SECRET } = require('../utils/config');
const { CREATE_STATUS, DUBLICATE_STATUS } = require('../utils/statusCode');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.status(CREATE_STATUS).send({
      _id: user._id, email: user.email, name: user.name,
    }))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequest(BAD_REQUSTER_ERROR_TEXT));
      } else if (err.code === DUBLICATE_STATUS) {
        next(new Conflict(CONFLICT_ERROR_TEXT));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(err));
};

const currentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFound(NOT_FOUND_ID_ERROR_TEXT))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFound(NOT_FOUND_ID_ERROR_TEXT))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequest(BAD_REQUSTER_ERROR_TEXT));
      } else if (err.code === DUBLICATE_STATUS) {
        next(new Conflict(CONFLICT_ERROR_TEXT));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  currentUser,
  updateUser,
};
