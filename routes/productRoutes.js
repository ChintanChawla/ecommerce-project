const express = require('express');
const router = express.Router();
const { createProduct, editProduct, deleteProduct,listProducts,searchProducts } = require('../controllers/productController');
const { authenticate, ensureSeller } = require('../middleware/authMiddleware');

// Route to create a product (sellers only)
router.post('/create', authenticate, ensureSeller, createProduct);

router.get('/list', listProducts);

router.post('/search', authenticate, searchProducts);

// Route to edit a product (sellers only, must own the product)
router.put('/edit/:id', authenticate, ensureSeller, editProduct);

// Route to delete a product (sellers only, must own the product)
router.delete('/delete/:id', authenticate, ensureSeller, deleteProduct);

module.exports = router;
