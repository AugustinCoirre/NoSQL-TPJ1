const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const getAllMovies = async (req, res) => {
  try {
    const db = getDB();
    const movies = await db.collection('movies').find({}).toArray();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) });
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMovie = async (req, res) => {
  try {
    const db = getDB();
    
    // Vérifier que le réalisateur existe
    if (req.body.director_id && ObjectId.isValid(req.body.director_id)) {
      const director = await db.collection('directors').findOne({ 
        _id: new ObjectId(req.body.director_id) 
      });
      
      if (!director) {
        return res.status(404).json({ error: 'Director not found' });
      }
    }
    
    const result = await db.collection('movies').insertOne(req.body);
    const newMovie = await db.collection('movies').findOne({ _id: result.insertedId });
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const result = await db.collection('movies').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const result = await db.collection('movies').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};