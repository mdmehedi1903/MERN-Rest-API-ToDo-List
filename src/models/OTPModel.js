const  mongoose=require('mongoose');
const OTPSchema=mongoose.Schema({
    email:{type:String},
    otp:{type:String},
    passwordStatus:{type:Number,default:0},
    status:{type:Number,default:0},
},{timestamps: true,versionKey:false});
const OTPModel=mongoose.model('otps',OTPSchema);
module.exports=OTPModel

