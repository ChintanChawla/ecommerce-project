const express = require("express");
const router = express.Router();
const {
  addInCart,
  removeFromCart,
  getCart,
} = require("../controllers/cartController");
const { authenticate, ensureBuyer} = require("../middleware/authMiddleware");

router.post("/addInCart", authenticate,ensureBuyer, addInCart);
router.post("/removeFromCart", authenticate,ensureBuyer, removeFromCart);
router.get("/getCart", authenticate, ensureBuyer,getCart);

module.exports = router;
