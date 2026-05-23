import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName:{ type:String, required:true },
  lastName:{ type:String, required:true },
  profilePic:{ type:String, default:"" },
  profilePublicPic:{ type:String, default:"" },
  email:{ type:String, unique:true },
  password:{ type:String, required:true },
  role:{ type:String, enum:["user","admin"],default:"user" },
  token:{ type:String, default:null },
  isVerified:{ type:Boolean, default:false },
  isLoggedIn:{ type:Boolean, required:false },
  otp:{ type:String, default:null },
  otpExpiry:{ type:Date,default:null },
  city:{ type:String },
  zipCode:{ type:String },
  phoneNo:{ type:String },
  address:{ type:String },
  addresses:[{
    fullName:{ type:String },
    phone:{ type:String },
    email:{ type:String },
    address:{ type:String },
    city:{ type:String },
    state:{ type:String },
    zip:{ type:String },
    country:{ type:String }
  }]
},{timestamps:true});

const User = mongoose.model("User", userSchema);

export default User;