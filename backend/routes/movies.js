const express = require('express');
const router = express.Router();
const { validate, movieSchema } = require('../middleware/validators');
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/moviesController');

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Récupère tous les films
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Liste des films
 */
router.get('/', getAllMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Récupère un film par ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Film trouvé
 *       404:
 *         description: Film non trouvé
 */
router.get('/:id', getMovieById);

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Crée un nouveau film
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - director_id
 *               - release_year
 *             properties:
 *               title:
 *                 type: string
 *               director_id:
 *                 type: string
 *               release_year:
 *                 type: number
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *               duration:
 *                 type: number
 *               synopsis:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Film créé
 */
router.post('/', validate(movieSchema), createMovie);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Met à jour un film
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Film mis à jour
 */
router.put('/:id', validate(movieSchema), updateMovie);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Supprime un film
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Film supprimé
 */
router.delete('/:id', deleteMovie);

module.exports = router;