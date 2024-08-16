const pool = require("../config/db"); // Import the database connection

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, description, price, discount, image_url, category } = req.body;
  const seller_id = req.user.id;

  try {
    const newProduct = await pool.query(
      `INSERT INTO products (name, description, price, discount,category, seller_id,image_url)
       VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *`,
      [name, description, price, discount || 0, category, seller_id, image_url]
    );

    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
// List the products
exports.listProducts = async (req, res) => {
  try {
    const products = await pool.query(
      "SELECT id, name, description, price, discount, category,image_url  FROM products"
    );
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    res.json({ data: product.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Edit an existing product
exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, discount, category, image_url } = req.body;
  const seller_id = req.user.id;

  try {
    // Check if the product belongs to the logged-in seller
    const product = await pool.query(
      "SELECT * FROM products WHERE id = $1 AND seller_id = $2",
      [id, seller_id]
    );

    if (product.rows.length === 0) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to edit this product." });
    }

    // Update the product
    const updatedProduct = await pool.query(
      `UPDATE products SET name = $1, description = $2, price = $3, discount = $4, category = $5,image_url=$6, updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [name, description, price, discount, category, image_url, id]
    );

    res.json(updatedProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  const seller_id = req.user.id;

  try {
    // Check if the product belongs to the logged-in seller
    const product = await pool.query(
      "SELECT * FROM products WHERE id = $1 AND seller_id = $2",
      [id, seller_id]
    );

    if (product.rows.length === 0) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to delete this product." });
    }

    // Delete the product
    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.json({ msg: "Product deleted successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.searchProducts = async (req, res) => {
  const query = req.body.query; // Get the search query from the request
  if (!query) {
    return res.status(400).json({ msg: "Search query is required" });
  }

  try {
    // Perform a case-insensitive search on the name and description fields
    const products = await pool.query(
      `SELECT id, name, description, price, discount, category, seller_id,image_url
       FROM products 
       WHERE name ILIKE $1 OR description ILIKE $1`,
      [`%${query}%`]
    );

    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.listSellerProducts = async (req, res) => {
  const seller_id = req.user.id;
  try {
    const products = await pool.query(
      "SELECT id, name, description, price, discount,seller_id,image_url, category FROM products WHERE seller_id = $1",
      [seller_id]
    );
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    res.json({ data: product.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
