const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Unauthorized = require('../utils/errors/UnauthorizedError');
const { AUTHORIZATION_ERROR_TEXT, EMAIL_ERROR_TEXT } = require('../utils/errorsMessage');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: EMAIL_ERROR_TEXT,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized(AUTHORIZATION_ERROR_TEXT));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized(AUTHORIZATION_ERROR_TEXT));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
