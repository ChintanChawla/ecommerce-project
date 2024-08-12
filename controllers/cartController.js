const pool = require("../config/db"); // Import the database connection

// Create a new product
exports.addInCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id; // Assuming you're using JWT and the user's ID is in req.user

  try {
    const cart = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );
    if (cart.rows.length === 1) {
      let id = cart.rows[0].id;
      console.log(cart.rows[0]);
      let updateQuantity = cart.rows[0].quantity + quantity;
      console.log(updateQuantity);
      const updatedCart = await pool.query(
        `UPDATE cart SET quantity = $1, updated_at = NOW()
         WHERE id = $2 RETURNING *`,
        [updateQuantity, id]
      );

      return res.json(updatedCart.rows[0]);
    }
    const newProduct = await pool.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, product_id, quantity]
    );

    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.removeFromCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  try {
    const cartItem = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );
    if (cartItem.rows.length === 0) {
      return res.status(403).json({ msg: "Cart is empty" });
    }
    const id = cartItem.rows[0].id;
    let updateQuantity = cartItem.rows[0].quantity - quantity;
    if (updateQuantity <= 0) {
      await pool.query("DELETE FROM cart WHERE id = $1", [id]);
    } else {
      await pool.query(
        `UPDATE cart SET quantity = $1, updated_at = NOW()
         WHERE id = $2 RETURNING *`,
        [updateQuantity, id]
      );
    }

    res.json({ msg: "Product deleted successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getCart = async (req, res) => {
  const user_id = req.user.id; 

  try {
    const cartItems = await pool.query(
      `SELECT ci.id, p.name, p.description, p.price, p.discount, ci.quantity
       FROM cart ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [user_id]
    );

    res.json(cartItems.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
