let jwt = require('jsonwebtoken');

module.exports=(req,res, next)=>{
    let token = req.headers['token'];
    jwt.verify(token, "SecretKey12345", (err, decoded)=>{
        if(err){
            res.status(401).json({status:"Unauthorized!"})
        }else{

            //Get Username from Decoded token and Added with req header
            let userName = decoded['data']['userName'];
            console.log(userName);
            req.headers.userName = userName;
            next();
        }
    })
}