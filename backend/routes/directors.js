const express = require("express");
const router = express.Router();
const { validate, directorSchema } = require("../middleware/validators");
const {
  getAllDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector,
} = require("../controllers/directorsController");

/**
 * @swagger
 * /directors:
 *   get:
 *     summary: Récupère tous les réalisateurs
 *     tags: [Directors]
 *     responses:
 *       200:
 *         description: Liste des réalisateurs
 */
router.get("/", getAllDirectors);

/**
 * @swagger
 * /directors/{id}:
 *   get:
 *     summary: Récupère un réalisateur par ID
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réalisateur trouvé
 *       404:
 *         description: Réalisateur non trouvé
 */
router.get("/:id", getDirectorById);

/**
 * @swagger
 * /directors:
 *   post:
 *     summary: Crée un nouveau réalisateur
 *     tags: [Directors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               birth_year:
 *                 type: number
 *               nationality:
 *                 type: string
 *               biography:
 *                 type: string
 *     responses:
 *       201:
 *         description: Réalisateur créé
 */
router.post("/", validate(directorSchema), createDirector);

/**
 * @swagger
 * /directors/{id}:
 *   put:
 *     summary: Met à jour un réalisateur
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Réalisateur mis à jour
 */
router.put("/:id", validate(directorSchema), updateDirector);

/**
 * @swagger
 * /directors/{id}:
 *   delete:
 *     summary: Supprime un réalisateur
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réalisateur supprimé
 */
router.delete("/:id", deleteDirector);

module.exports = router;
