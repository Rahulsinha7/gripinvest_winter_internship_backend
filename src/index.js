const express=require('express');
const app=express();
require('dotenv').config();
const main=require("./config/db");
const cookieParser=require('cookie-parser');
const authRouter=require("./routes/userAuth");
const productRouter=require('./routes/productCreator');
const redisClient=require('./config/redis');
const cors=require('cors');
const holdingRouter = require('./routes/holdingRouter');

app.use(cors({ 
    origin:'http://localhost:5173',
    credentials:true
}))



app.use(express.json());
app.use(cookieParser());

app.use('/user',authRouter);
app.use('/product',productRouter);
app.use('/holding',holdingRouter);

const InitializeConnection=async ()=>{
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connectes");

         app.listen(process.env.PORT,()=>{
             console.log('Server is running on port:'+process.env.PORT);
}) 

    }
    catch(err){
        console.log("Error: "+err);

    }
}

InitializeConnection();