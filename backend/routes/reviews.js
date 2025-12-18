const express = require('express');
const router = express.Router();
const { validate, reviewSchema } = require('../middleware/validators');
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewsController');

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Récupère toutes les critiques
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Liste des critiques
 */
router.get('/', getAllReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Récupère une critique par ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Critique trouvée
 *       404:
 *         description: Critique non trouvée
 */
router.get('/:id', getReviewById);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Crée une nouvelle critique
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movie_id
 *               - author
 *               - rating
 *             properties:
 *               movie_id:
 *                 type: string
 *               author:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Critique créée
 */
router.post('/', validate(reviewSchema), createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Met à jour une critique
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Critique mise à jour
 */
router.put('/:id', validate(reviewSchema), updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Supprime une critique
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Critique supprimée
 */
router.delete('/:id', deleteReview);

module.exports = router;