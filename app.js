const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests

app.use(cors())

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);


module.exports = app;
