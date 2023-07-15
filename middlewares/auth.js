const jwt = require('jsonwebtoken');
const Unauthorized = require('../utils/errors/UnauthorizedError');
const { SECRET } = require('../utils/config');
const { TOKEN_ERROR_TEXT } = require('../utils/errorsMessage');

const handleAuthError = (res, req, next) => {
  next(new Unauthorized(TOKEN_ERROR_TEXT));
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res, req, next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    return handleAuthError(res, req, next);
  }

  req.user = payload;

  return next();
};
