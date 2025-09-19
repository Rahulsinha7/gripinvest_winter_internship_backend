const mongoose=require('mongoose');
const Holding = require('../models/Holding');
const Product = require('../models/Product');
const User = require('../models/users');


const buyProduct = async (req, res) => {
    try {
      
        const { productId, amount } = req.body;
        const userId = req.user._id; 

        if (!productId || !amount) {
            return res.status(400).json({ message: "Product ID and investment amount are required." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Investment product not found." });
        }
        if (amount < product.min_investment) {
            return res.status(400).json({ message: `Investment must be at least ${product.min_investment}.`});
        }
        const newHolding = await Holding.create({
            userId,
            productId,
            investmentAmount: amount,
            purchaseDate: new Date(),
        });

        res.status(201).json({ message: "Investment successful!", holding: newHolding });

    } catch (err) {
        console.error("ERROR in buyProduct:", err);
        res.status(500).json({ message: "Server error during purchase.", error: err.message });
    }
};

const sellProduct = async (req, res) => {
    try {
        const { holdingId } = req.params;
        const userId = req.user._id;

        const holding = await Holding.findById(holdingId);

        if (!holding) {
            return res.status(404).json({ message: "This holding does not exist." });
        }
        if (holding.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Forbidden. You do not own this asset." });
        }

        if (holding.status === 'sold') {
            return res.status(400).json({ message: "This holding has already been sold." });
        }
        
        const currentValue = holding.investmentAmount * (1 + Math.random() * 0.2 - 0.1); 

        holding.status = 'sold';
        holding.sellDate = new Date();
        holding.sellValue = parseFloat(currentValue.toFixed(2));

        const updatedHolding = await holding.save();

        res.status(200).json({ message: "Successfully sold holding!", holding: updatedHolding });

    } catch (err) {
        console.error("ERROR in sellProduct:", err);
        res.status(500).json({ message: "Server error during sale.", error: err.message });
    }
};

const getUserPortfolio = async (req, res) => {
    try {
        const userId = req.user._id;
        const holdings = await Holding.find({ userId: userId }).populate({
            path: 'productId',
            select: 'name difficulty tags annual_yield' 
        });

        if (!holdings || holdings.length === 0) {
            return res.status(200).json({ message: "Your portfolio is empty.", portfolio: [] });
        }
        
        res.status(200).json({ portfolio: holdings });

    } catch (err) {
        console.error("ERROR in getUserPortfolio:", err);
        res.status(500).json({ message: "Server error fetching portfolio.", error: err.message });
    }
};

module.exports = { buyProduct, sellProduct,getUserPortfolio };
