const router = require('express').Router();
const { createMovie, deleteMovie, getSavedMovies } = require('../controllers/movie');
const { validateCreateMovie, validateMovieId } = require('../middlewares/validation');

router.get('/', getSavedMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
