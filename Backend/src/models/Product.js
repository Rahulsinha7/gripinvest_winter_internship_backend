const mongoose = require('mongoose');
const { Schema } = mongoose;

const investSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['high', 'medium', 'low'],
    required: true,
  },
  tags: {
    type: [String],
    enum: ['bond', 'fd', 'mf', 'etf',  'real estate', 'crypto', 'startup'],
    required: true,
  },

  tenure_months: {
    type: Number,
    required: true,
  },
 
  annual_yield: {
    type: Number,
    required: true,
  },

  min_investment: {
    type: Number,
    default: 500.00,
    required: true
  },

  max_investment: {
    type: Number,
  },

  description: {
    type: String,
    trim: true,
    required: true,
  },
  
},{
    timestamps:true,
    
});

const Investment = mongoose.model('Product', investSchema);

module.exports = Investment;
