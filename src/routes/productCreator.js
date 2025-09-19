const express = require('express');

const productRouter =  express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const { createProduct, updateProduct, deleteProduct, getProductById, getAllProduct,BuyAllProductbyUser} = require("../controllers/userProduct");
const userMiddleware = require("../middleware/userMiddleware");


// Create
productRouter.post("/create",adminMiddleware ,createProduct);
productRouter.put("/update/:id",adminMiddleware, updateProduct);
productRouter.delete("/delete/:id",adminMiddleware, deleteProduct);


productRouter.get("/productById/:id",userMiddleware,getProductById);
productRouter.get("/getAllProduct",userMiddleware, getAllProduct);
productRouter.get("/productBuyByUser",userMiddleware, BuyAllProductbyUser);
// productRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem);


module.exports = productRouter;