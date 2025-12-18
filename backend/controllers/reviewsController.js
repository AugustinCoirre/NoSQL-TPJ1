const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const getAllReviews = async (req, res) => {
  try {
    const db = getDB();
    const reviews = await db.collection('reviews').find({}).toArray();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const review = await db.collection('reviews').findOne({ _id: new ObjectId(id) });
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const db = getDB();
    
    // Vérifier que le film existe
    if (req.body.movie_id && ObjectId.isValid(req.body.movie_id)) {
      const movie = await db.collection('movies').findOne({ 
        _id: new ObjectId(req.body.movie_id) 
      });
      
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
    }
    
    const result = await db.collection('reviews').insertOne(req.body);
    const newReview = await db.collection('reviews').findOne({ _id: result.insertedId });
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const result = await db.collection('reviews').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    const result = await db.collection('reviews').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};