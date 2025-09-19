const Product = require("../models/Product");
const User = require("../models/users");

const createProduct = async (req, res) => {
    
    const {
        name,
        difficulty,
        tags,
        tenure_months,
        annual_yield,
        min_investment,
        max_investment,
        description
    } = req.body;

  
    if (!name || !difficulty || !tags || !tenure_months || !annual_yield || !min_investment || !description) {
        return res.status(400).json({
            message: "Please provide all required fields: name, difficulty, tags, tenure_months, and annual_yield."
        });
    }

    try {
      
        const newProduct = await Product.create({
            name,
            difficulty,
            tags,
            tenure_months,
            annual_yield,
            min_investment,
            max_investment,
            description
        });

        res.status(201).json({ message: "Investment product created successfully!", product: newProduct });
    } catch (err) {
     
        res.status(500).json({ message: "Server error while creating the product.", error: err.message });
    }
};


const updateProduct = async (req, res) => {
    const { id } = req.params;

    try {
      
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found with this ID." });
        }

        res.status(200).json({ message: "Product updated successfully.", product: updatedProduct });
    } catch (err) {
        res.status(500).json({ message: "Server error while updating the product.", error: err.message });
    }
};


const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found with this ID." });
        }

        res.status(200).json({ message: "Product deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: "Server error while deleting the product.", error: err.message });
    }
};



const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found with this ID." });
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: "Server error while fetching the product.", error: err.message });
    }
};


const getAllProduct = async (req, res) => {
    try {
       
        const products = await Product.find({}).select('_id name difficulty tags annual_yield');

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No investment products found." });
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Server error while fetching all products.", error: err.message });
    }
};

const BuyAllProductbyUser = async (req, res) => {
    try {
        // FIX #1: Changed req.result to req.user, which is the standard convention.
        // Your userMiddleware should attach the decoded JWT payload to req.user.
        const userId = req.user._id;

        // Check if userId exists before proceeding
        if (!userId) {
            return res.status(401).json({ message: "Authorization failed: User ID not found in token." });
        }

        const user = await User.findById(userId).populate({
            path: 'productsBought',
            select: '_id name difficulty tags annual_yield'
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user.productsBought);

    } catch (err) {
        console.error("ERROR in BuyAllProductbyUser:", err);
        res.status(500).json({
            message: "Server error while fetching purchased products.",
            error: err.message 
        });
    }
};



module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getAllProduct,
    BuyAllProductbyUser
};
