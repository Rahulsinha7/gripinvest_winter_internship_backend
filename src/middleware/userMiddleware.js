const jwt = require("jsonwebtoken");
const User = require("../models/users");
const redisClient = require("../config/redis");

const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not present");
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);
    const { _id } = payload;

    if (!_id) {
      throw new Error("Invalid token");
    }

    // You find the specific user and store it in 'result'
    const result = await User.findById(_id);

    if (!result) {
      throw new Error("User Doesn't Exist");
    }

    const IsBlocked = await redisClient.exists(`token:${token}`);

    if (IsBlocked) {
      throw new Error("Invalid Token");
    }
    req.user = result;
    next();
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

module.exports = userMiddleware;