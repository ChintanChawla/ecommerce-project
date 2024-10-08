const express = require("express");
const router = express.Router();
const {
  createProduct,
  editProduct,
  deleteProduct,
  listProducts,
  searchProducts,
  getProduct,
  listSellerProducts,
  listP
} = require("../controllers/productController");
const { authenticate, ensureSeller } = require("../middleware/authMiddleware");

// Route to create a product (sellers only)
router.post("/create", authenticate, ensureSeller, createProduct);
router.get("/list", listProducts);
router.get("/listSellerProducts",authenticate,listSellerProducts);
router.get("/getProduct/:id", getProduct);
router.post("/search", authenticate, searchProducts);
router.put("/edit/:id", authenticate, ensureSeller, editProduct);
router.delete("/delete/:id", authenticate, ensureSeller, deleteProduct);

module.exports = router;
