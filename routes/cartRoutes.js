const express = require('express');
const router = express.Router();
const { addInCart,removeFromCart,getCart } = require('../controllers/cartController');
const { authenticate, ensureSeller } = require('../middleware/authMiddleware');


router.post('/addInCart', authenticate, addInCart);


router.post('/removeFromCart', authenticate, removeFromCart);

router.get('/getCart', authenticate, getCart);

module.exports = router;
