const router = require('express').Router();
const { currentUser, updateUser } = require('../controllers/user');
const { validateUpdateUser } = require('../middlewares/validation');

router.get('/me', currentUser);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
