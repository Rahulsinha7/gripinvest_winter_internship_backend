const mongoose= require('mongoose');
const {Schema}=mongoose;

const userSchema=new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true,
    },
    age:{
        type:Number,
        max:80,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
     password:{
        type:String,
        required:true,
    },
     password_reset_otp: {
    type: String,   
    default: null,
  },
  otp_expiry_date: {
    type: Date,    
    default: null,
  }

},{
    timestamps:true,
    
})

const User=mongoose.model("user",userSchema);
module.exports=User; 