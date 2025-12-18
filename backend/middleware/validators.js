const Joi = require('joi');

// Schéma de validation pour les réalisateurs
const directorSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  birth_year: Joi.number().integer().min(1800).max(new Date().getFullYear()),
  nationality: Joi.string().max(50),
  biography: Joi.string().max(2000)
});

// Schéma de validation pour les films
const movieSchema = Joi.object({
  title: Joi.string().required().min(1).max(200),
  director_id: Joi.string().required().length(24).hex(),
  release_year: Joi.number().integer().min(1800).max(new Date().getFullYear() + 5).required(),
  genre: Joi.array().items(Joi.string().max(50)),
  duration: Joi.number().integer().min(1).max(1000),
  synopsis: Joi.string().max(2000),
  rating: Joi.number().min(0).max(10)
});

// Schéma de validation pour les critiques
const reviewSchema = Joi.object({
  movie_id: Joi.string().required().length(24).hex(),
  author: Joi.string().required().min(2).max(100),
  rating: Joi.number().required().min(0).max(10),
  comment: Joi.string().max(2000),
  date: Joi.date().default(Date.now)
});

// Middleware de validation
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details.map(d => d.message) 
      });
    }
    next();
  };
};

module.exports = {
  validate,
  directorSchema,
  movieSchema,
  reviewSchema
};