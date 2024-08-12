const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cors = require("cors");
const app = express();


app.use(bodyParser.json());

app.use(cors());


// Routes
app.use("/api/auth", authRoutes); 
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

module.exports = app;
