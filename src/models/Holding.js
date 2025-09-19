const mongoose = require('mongoose');
const { Schema } = mongoose;

const holdingSchema = new Schema({
   
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
 
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product', 
        required: true,
    },
    investmentAmount: {
        type: Number,
        required: true,
        min: 1, 
    },
  
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
   
    status: {
        type: String,
        enum: ['active', 'sold'],
        default: 'active',
    },

    sellDate: {
        type: Date,
    },
  
    sellValue: {
        type: Number,
    },
}, { timestamps: true });

const Holding = mongoose.model('Holding', holdingSchema);
module.exports = Holding;