const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = Schema(
    {
        userName: {type: String},
        todoSubject: {type: String},
        todoDes: {type: String},
        status: {type: String},
        createDate: {type: Date},
        updateDate: {type: Date},
    },

    {versionKey: false, timestamps: false}

)

const todoListModel = mongoose.model('lists', dataSchema);
module.exports = todoListModel;