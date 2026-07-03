const mongoose=require("mongoose")
const { authDB } = require("../db");

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User is required"]
    },
    otpHash:{
        type:String,
        required:[true,"OTP hash is required"]
    },
    expiresAt:{
        type:Date,
        required:true
    }
},{timestamps:true})

const otpmodel=authDB.model("otps",otpSchema)
module.exports=otpmodel