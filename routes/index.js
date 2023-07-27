const router = require('express').Router();
const { createUser, login } = require('../controllers/user');
const auth = require('../middlewares/auth');
const { validateLogin, validateCreateUser } = require('../middlewares/validation');
const NotFoundError = require('../utils/errors/NotFoundError');
const { NOT_FOUND_PAGE_ERROR_TEXT } = require('../utils/errorsMessage');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_PAGE_ERROR_TEXT));
});

module.exports = router;
