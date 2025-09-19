const redisClient = require("../config/redis");
const User =  require("../models/users")
const validate = require('../utils/validators');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');



const register = async (req,res)=>{
    
    try{
        // validate the data;

      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
      req.body.role = 'user'
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:'user'},process.env.JWT_KEY,{expiresIn: 60*60});
     const reply = {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id,
        role:user.role,
    }
    
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).json({
        user:reply,
        message:"Loggin Successfully"
    })
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const login = async (req,res)=>{

    try{
        const {emailId, password} = req.body;

        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailId});

        const match = await bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Invalid Credentials");

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role:user.role,
        }

        const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).json({
            user:reply,
            message:"Loggin Successfully"
        })
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}


const logout = async(req,res)=>{

    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);


        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);
    //    Token add kar dung Redis ke blockList
    //    Cookies ko clear kar dena.....

    res.cookie("token",null,{expires: new Date(Date.now())});
    res.send("Logged Out Succesfully");

    }
    catch(err){
       res.status(503).send("Error: "+err);
    }
}


const adminRegister = async(req,res)=>{
    try{
        // validate the data;
    //   if(req.result.role!='admin')
    //     throw new Error("Invalid Credentials");  
      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
      
    // userSchema delete
    await User.findByIdAndDelete(userId);

    // Submission se bhi delete karo...
    
    // await Submission.deleteMany({userId});
    
    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { emailId } = req.body;
        if (!emailId) {
            throw new Error("Email is required");
        }

        const user = await User.findOne({ emailId });
        
        // IMPORTANT: Always send a success response to prevent email enumeration attacks
        if (!user) {
            return res.status(200).json({ message: "If an account with this email exists, a reset code has been sent." });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

        // Hash the OTP before saving
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Save hashed OTP and expiry date to the user
        user.password_reset_otp = hashedOtp;
        user.otp_expiry_date = otpExpires;
        await user.save();

        // --- TODO: Implement your email sending logic here ---
        // await sendEmail(user.emailId, "Your Password Reset OTP", `Your OTP is: ${otp}`);
        console.log(`Email sent to ${user.emailId} with OTP: ${otp}`); // For testing

        res.status(200).json({ message: "If an account with this email exists, a reset code has been sent." });

    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
};


// --- 2. VERIFY OTP CONTROLLER ---
// Verifies the OTP provided by the user.

const verifyOtp = async (req, res) => {
    try {
        const { emailId, otp } = req.body;
        if (!emailId || !otp) {
            throw new Error("Email and OTP are required");
        }

        const user = await User.findOne({ emailId });
        if (!user || !user.password_reset_otp) {
            throw new Error("Invalid OTP or email address.");
        }

        // Check if OTP has expired
        if (new Date() > user.otp_expiry_date) {
            // Clear the expired OTP from the database
            user.password_reset_otp = null;
            user.otp_expiry_date = null;
            await user.save();
            throw new Error("OTP has expired. Please request a new one.");
        }

        // Compare the provided OTP with the hashed OTP in the database
        const isMatch = await bcrypt.compare(otp, user.password_reset_otp);
        if (!isMatch) {
            throw new Error("Invalid OTP.");
        }

        res.status(200).json({ message: "OTP verified successfully. You can now reset your password." });

    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
};


// --- 3. RESET PASSWORD CONTROLLER ---
// Resets the user's password after successful OTP verification.

const resetPassword = async (req, res) => {
    try {
        const { emailId, otp, newPassword } = req.body;
        if (!emailId || !otp || !newPassword) {
            throw new Error("Email, OTP, and a new password are required");
        }

        const user = await User.findOne({ emailId });
        if (!user || !user.password_reset_otp) {
            throw new Error("Invalid request. Please start the password reset process again.");
        }

        // Re-verify the OTP and its expiry for security
        if (new Date() > user.otp_expiry_date) {
            throw new Error("OTP has expired. Please request a new one.");
        }

        const isMatch = await bcrypt.compare(otp, user.password_reset_otp);
        if (!isMatch) {
            throw new Error("Invalid OTP provided.");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.password_reset_otp = null; 
        user.otp_expiry_date = null;
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully." });

    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
};





module.exports = {register, login,logout,adminRegister,deleteProfile,forgotPassword,verifyOtp,resetPassword};