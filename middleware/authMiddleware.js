const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_PASS); // Replace with your secret
    req.user = decoded.user; // Decoded user object contains id, username, and role

    next();
  } catch (err) {
    res.status(401).json({ msg: err });
  }
};

exports.ensureSeller = (req, res, next) => {
  // Now you can directly access the role from req.user
  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ msg: "Access denied. Only sellers can perform this action." });
  }

  next();
};

exports.ensureBuyer = (req, res, next) => {
  // Now you can directly access the role from req.user
  if (req.user.role !== "buyer") {
    return res
      .status(403)
      .json({ msg: "Access denied. Only sellers can perform this action." });
  }

  next();
};

