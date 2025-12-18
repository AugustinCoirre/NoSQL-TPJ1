const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');
const swaggerSetup = require('./swagger/swagger');

const directorsRoutes = require('./routes/directors');
const moviesRoutes = require('./routes/movies');
const reviewsRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
swaggerSetup(app);

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Mongoflix',
    documentation: '/api-docs'
  });
});

app.use('/directors', directorsRoutes);
app.use('/movies', moviesRoutes);
app.use('/reviews', reviewsRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Connexion à la DB et démarrage du serveur
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  });
}).catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err);
  process.exit(1);
});