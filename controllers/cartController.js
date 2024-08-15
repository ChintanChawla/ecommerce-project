
const pool = require("../config/db"); // Import the database connection

// Create a new product
exports.addInCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.id;

  try {
    const cart = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    let updatedCart;
    let updateQuantity = quantity;

    if (cart.rows.length === 1) {
      const { id, quantity: currentQuantity } = cart.rows[0];
      updateQuantity += currentQuantity;

      updatedCart = await pool.query(
        `UPDATE cart SET quantity = $1, updated_at = NOW()
         WHERE id = $2 RETURNING *`,
        [updateQuantity, id]
      );
    } else {
      updatedCart = await pool.query(
        `INSERT INTO cart (user_id, product_id, quantity)
         VALUES ($1, $2, $3) RETURNING *`,
        [user_id, product_id, quantity]
      );
    }

    const product = await pool.query(
      "SELECT price, discount FROM products WHERE id = $1",
      [product_id]
    );

    const total_price = (
      product.rows[0].price *
      (1 - product.rows[0].discount / 100) *
      updateQuantity
    ).toFixed(2);

    const totalCartPriceResult = await pool.query(
      `SELECT SUM(p.price * (1 - p.discount / 100) * ci.quantity) AS totalCartPrice
       FROM cart ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [user_id]
    );

    const totalCartPrice = parseFloat(totalCartPriceResult.rows[0].totalcartprice).toFixed(2);

    return res.json({
      ...updatedCart.rows[0],
      total_price,
      totalCartPrice,
    });

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
    let isRemoved = false;
    let updatedCart = cartItem.rows[0];
    let total_price = "0.00";
    console.log('updateQuantity',updateQuantity)
    if (updateQuantity <= 0) {
      await pool.query("DELETE FROM cart WHERE id = $1", [id]);
      isRemoved = true;
      return res.json({quantity:0})
    } else {
      console.log('in else')
      updatedCart = await pool.query(
        `UPDATE cart SET quantity = $1, updated_at = NOW()
         WHERE id = $2 RETURNING *`,
        [updateQuantity, id]
      );

      const product = await pool.query(
        "SELECT price, discount FROM products WHERE id = $1",
        [product_id]
      );

      total_price = (
        product.rows[0].price *
        (1 - product.rows[0].discount / 100) *
        updateQuantity
      ).toFixed(2);
    }
    console.log('after condition')

    const totalCartPriceResult = await pool.query(
      `SELECT SUM(p.price * (1 - p.discount / 100) * ci.quantity) AS totalCartPrice
       FROM cart ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [user_id]
    );

    const totalCartPrice = parseFloat(totalCartPriceResult.rows[0].totalcartprice).toFixed(2);
    updatedCart=updatedCart.rows[0]
    

    return res.json({
      id: updatedCart.id,
      user_id: updatedCart.user_id,
      product_id: updatedCart.product_id,
      quantity: isRemoved ? 0 : updateQuantity,
      created_at: updatedCart.created_at,
      updated_at: new Date().toISOString(), // Ensure updated_at reflects the latest update time
      total_price,
      totalCartPrice,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.getCart = async (req, res) => {
  const user_id = req.user.id;

  try {
    const cartItems = await pool.query(
      `SELECT ci.id,ci.product_id, p.name, p.description, p.price, p.discount, ci.quantity,
              (p.price * (1 - p.discount / 100) * ci.quantity) AS total_price
       FROM cart ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [user_id]
    );

    // Format the prices to 2 decimal places
    const formattedCartItems = cartItems.rows.map((item) => ({
      ...item,
      price: parseFloat(item.price).toFixed(2),
      discount: parseFloat(item.discount).toFixed(2),
      total_price: parseFloat(item.total_price).toFixed(2),
    }));

    // Calculate the total cart price with proper floating-point addition
    const totalCartPrice = formattedCartItems
      .reduce((sum, item) => sum + parseFloat(item.total_price), 0)
      .toFixed(2);

    // Send the response
    res.json({
      cartItems: formattedCartItems,
      totalCartPrice,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
