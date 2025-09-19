const express = require('express');

const holdingRouter =  express.Router();
const { buyProduct, sellProduct, getUserPortfolio } = require("../controllers/holdingController");
const userMiddleware = require("../middleware/userMiddleware");





holdingRouter.post("/buy", userMiddleware, buyProduct);
holdingRouter.put("/sell/:holdingId", userMiddleware, sellProduct);
holdingRouter.get("/portfolio", userMiddleware, getUserPortfolio);

module.exports = holdingRouter;