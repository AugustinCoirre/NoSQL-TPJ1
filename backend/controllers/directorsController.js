const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

// GET tous les réalisateurs
const getAllDirectors = async (req, res) => {
  try {
    const db = getDB();
    const directors = await db.collection("directors").find({}).toArray();
    res.json(directors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET un réalisateur par ID
const getDirectorById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const director = await db
      .collection("directors")
      .findOne({ _id: new ObjectId(id) });

    if (!director) {
      return res.status(404).json({ error: "Director not found" });
    }

    res.json(director);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST créer un réalisateur
const createDirector = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("directors").insertOne(req.body);
    const newDirector = await db
      .collection("directors")
      .findOne({ _id: result.insertedId });
    res.status(201).json(newDirector);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT mettre à jour un réalisateur
const updateDirector = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await db
      .collection("directors")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: req.body },
        { returnDocument: "after" }
      );

    if (!result) {
      return res.status(404).json({ error: "Director not found" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE supprimer un réalisateur
const deleteDirector = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await db
      .collection("directors")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Director not found" });
    }

    res.json({ message: "Director deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllDirectors,
  getDirectorById,
  createDirector,
  updateDirector,
  deleteDirector,
};
