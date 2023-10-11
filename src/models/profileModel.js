const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = Schema(
    {
        firstName: {type: String},
        lastName: {type: String},
        emailAddress: {type: String, unique: true},
        mobileNumber: {type: String,
            validate:{
                validator: (value)=>{
                    return /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/.test(value)
                },
                message: "Invalid Bangladeshi Mobile Number"
            }
        },
        city: {type: String},
        userName: {type: String, unique: true},
        password: {type: String},
    },

    {versionKey: false, timestamps: true}

)

const profileModel = mongoose.model('profiles', dataSchema);
module.exports = profileModel;