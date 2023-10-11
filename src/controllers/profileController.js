const jwt = require('jsonwebtoken');
const profileModel = require("../models/profileModel");
const { hashPassword, comparePassword } = require("../helpers/passwordBcrypt");
const OTPModel = require("../models/OTPModel");
const SendEmailUtility = require('../utility/sendEmailUtility')

exports.createProfile = async (req, res) => {
    const reqBody = req.body;
    const fullName = reqBody['firstName'] + " " + reqBody['lastName'];
    const email = reqBody['emailAddress'];
    const userName = reqBody['userName'];
    const password = reqBody['password'];
    let EmailText = `Dear ${fullName},\n\nUsername: ${userName}\nPassword: ${password}\n\nThank you for registering with Todo List Manager. We're thrilled to have you join our community.\n\nStart organizing your tasks and boosting your productivity today. If you have any questions or need assistance, feel free to reach out. Happy task managing!`;

    let EmailSubject="Welcome to Todo List Manager!";
  
    try {
      const hashedPassword = await hashPassword(password);
      const userBody = {
        firstName: reqBody['firstName'],
        lastName: reqBody['lastName'],
        emailAddress: email,
        mobileNumber: reqBody['mobileNumber'],
        city: reqBody['city'],
        userName: userName,
        password: hashedPassword
    }
    
      const data = await profileModel.create(userBody);
            //   Registration Email
        await SendEmailUtility(email,EmailText,EmailSubject);

        res.status(201).json({ status: "Success", data:data });
    } catch (err) {
        res.status(400).json({ status: "Failed", data: err });
    }
  };
   

  exports.userLogin = async (req, res) => {
    try {
      const userName = req.body['userName'];
      const password = req.body['password']; 
      const hashedPassword = await profileModel.find({ userName: userName});
      const match = await comparePassword(password, hashedPassword[0].password);  
      
      if(match){
        const result = await profileModel.find({ userName: userName});
        if (result.length > 0) {

          // Create Auth Token
          let PayLoad = {
              exp: Math.floor(Date.now()/1000)+(60*60*24),
              data: result[0]
          }
          let token = jwt.sign(PayLoad, "SecretKey12345")
  
          res.status(201).json({ status: "Login Success", token:token, data: result[0] });
        } 
      }else {
        res.status(400).json({ status: "Failed", data: "No User Found!" });
      }
   

    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "Error", data: "Server Error" });
    }
  };

 
 
  exports.readProfile = async (req, res) => {
    try {
      let userName = req.headers['userName'];
      let qery = {userName: userName};
      let projection = {_id: 0, password: 0};
      // let projection = "firstName lastName emailAddress mobileNumber city userName";
  
      const data = await profileModel.find(qery, projection);
  
      res.status(201).json({ status: "Success", data: data });
    } catch (err) {
      res.status(400).json({ status: "Failed", data: err });
    }
  }


  exports.updateProfile = async (req, res) => {
    try {
      let userName = req.headers['userName'];
      let reqBody = req.body;

      let query = {userName: userName};
      const data = await profileModel.updateOne(query, reqBody)
  
      res.status(201).json({ status: "Success", data: data });
    } catch (err) {
      res.status(400).json({ status: "Failed", data: err });
    }
  }

  exports.deleteProfile = async (req, res) => {

    let firstLastName = await profileModel.find({userName: req.headers['userName']});
    let email = firstLastName[0]['emailAddress']; 
    let fullName = firstLastName[0].firstName + " " + firstLastName[0].lastName;
    const EmailText = `Hi ${fullName},\n\nYou have successfully removed your ToDo account! \nWe miss you and welcome you to create a new account!\n\nThanks\nToDo Manager!`;
    const EmailSubject = `${fullName}, your account was successfully removed`;
 
    try {
      let userName = req.headers['userName'];
      // let id = new mongoose.Types.ObjectId(req.params.id);
      // let id = req.params.id;

      let query = {
        userName: userName,  
        // _id: id,
      };
      const data = await profileModel.deleteOne(query)
      await SendEmailUtility(email,EmailText,EmailSubject);
      res.status(201).json({ status: "Success", data: data });
    } catch (err) {
      res.status(400).json({ status: "Failed", data: err });
    }
  }

  

  // Password Reset

  exports.sendOTP = async (req, res) => {
      let OTPCode = Math.floor(100000 + Math.random() * 900000);
      let email = req.query.email;
      let query = {emailAddress:email};
      let projection = {_id:0,firstName:1,lastName:1};
      let passwordStatus = 0;

      let result = await profileModel.find(query, projection);
      if(result.length>0){
        let fullName = result[0].firstName + " " + result[0].lastName;
        const EmailText = `Dear ${fullName},\n\nYou have requested a password reset for your account. \nTo proceed with the reset, please use the following six-digit verification code:\n\nVerification Code: ${OTPCode}`;
        const EmailSubject = "ToDo List Verification Code";

        await OTPModel.create({email:email,otp:OTPCode,passwordStatus:passwordStatus});
        await SendEmailUtility(email,EmailText,EmailSubject);
        res.status(200).json({status:"Success!",data:"6 Digit Verification Code has been sent"})
      }
      else{
        res.status(400).json({status: "Failed!", data: "User not exist!"});
      }
    

  }
 

  exports.verifyOTP = async (req, res) => {
    let email = req.params.email;
    let OTPCode = req.params.otp;
    let status=0;
    let statusUpdate=1;

    let result= await OTPModel.find({email:email,otp:OTPCode,status:status}).count();
    // Time Validation 2 min

    if(result===1){
        await OTPModel.updateOne({email:email,otp:OTPCode,status:status}, {status:statusUpdate})
        res.status(201).json({status:"Success!",data:"Verification Completed!"})
    }
    else{
        res.status(400).json({status:"Failed!",data:"Invalid Verification Code!"})
    }

  }

  exports.resetPassword = async (req, res) => {
    let email = req.body['email'];
    let OTPCode = req.body['OTP'];
    let password =  req.body['password'];
    const hashedPassword = await hashPassword(password);
    let statusUpdate=1;
    let passwordStatusUpdate = 1;

    let result= await OTPModel.find({email:email,otp:OTPCode,status:statusUpdate}).count();
    if(result===1){
 
      let query = {emailAddress:email};
      let projection = {_id:0,firstName:1,lastName:1}

      let firstLastName = await profileModel.find(query, projection);

      let fullName = firstLastName[0].firstName + " " + firstLastName[0].lastName;
      const EmailText = `Hi ${fullName},\n\nYou have successfully changed your TodoList Password!`;
      const EmailSubject = `${fullName}, your password was successfully reset`;

      // Update Password
      let passwordCount = await OTPModel.find({email:email,passwordStatus: 0}).count();

      if(passwordCount===1){
        let result=await profileModel.updateOne({emailAddress: email}, {password:hashedPassword})
        await SendEmailUtility(email,EmailText,EmailSubject);
        await OTPModel.updateOne({email:email,otp:OTPCode}, {passwordStatus:passwordStatusUpdate})
        res.status(201).json({status:"Success!",status:"Password Reset Success!",data:result})
      }else{
        res.status(400).json({status:"Failed!", data:"Password Already Changed!"})
      }
    }
    else{
        res.status(400).json({status:"Failed!",data:"Invalid Verification!"})
    }
}

 