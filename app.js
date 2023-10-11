// Basic Configuration Lib Import
const express = require('express');
const router = require('./src/routes/api');
const app = new express();
const bodyParser = require('body-parser');

// Security Variable Configuration
const dotenv = require('dotenv');
dotenv.config({path:'./.env'}); 

// Security Middleware Lib Import
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors'); 
const hpp = require('hpp'); 

// Security Middleware Implement
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Body Parser Implement
app.use(bodyParser.json());

// Request Rate Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Too many requests from this IP, please try again later."
})
app.use(limiter);


// Database Lib Import
const mongoose = require('mongoose'); 

// MongoDB Connection
/* Atlas URI
/ const URI = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_USER_PASSWORD}@cluster0.fsp0qs4.mongodb.net/Your-Database-Name?retryWrites=true&w=majority`;*/

const DATABASE = process.env.DATABASE; 
mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => console.log("DB Connected at Localhost: ToDo"))
  .catch((err) => {
    console.error(err);
  });


// Routing Implement
app.use("/api/v1", router)

// Undefined Route Implement
app.use('*', (req,res)=>{
    res.status(404).json({status: "Failed!", data: "404 Error! Wrong route!"});
})

module.exports=app;
