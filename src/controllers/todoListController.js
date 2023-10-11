const todoListModel = require("../models/todoListModel");

exports.createTodoList= async (req,res)=>{
    try{
        let reqBody = req.body;
        let todoSubject = reqBody['todoSubject'];
        let todoDes = reqBody['todoDes'];
        let userName = req.headers['userName'];
        let status = "New";
        let createDate = Date.now();
        let updateDate = Date.now();

        let postBody = {
            userName: userName,
            todoSubject: todoSubject,
            todoDes: todoDes,
            status: status,
            createDate: createDate,
            updateDate: updateDate
        }
        const data = await todoListModel.create(postBody);
        res.status(201).json({ status: "Success", data:data });

    }catch(error){
        res.status(400).json({ status: "Failed", data: error });
    }
}

exports.readTodolist = async (req,res)=>{
    try{
    let userName = req.headers['userName'];
    let query = {userName: userName};
    const data = await todoListModel.find(query);
    res.status(201).json({ status: "Success", data:data });

    }catch(error){
        res.status(400).json({ status: "Failed", data: error });
    }
}

exports.updateTodolist = async (req,res)=>{
    try{
        let reqBody = req.body;
        let id = reqBody['_id'];
        let todoSubject = reqBody['todoSubject'];
        let todoDes = reqBody['todoDes'];
        let updateDate = Date.now();

        let postBody = {
            todoSubject: todoSubject,
            todoDes: todoDes,
            updateDate: updateDate
        }
        const data = await todoListModel.updateOne({_id:id}, {$set:postBody}, {upsert: true});
        res.status(201).json({ status: "Success", data:data });

    }catch(error){
        res.status(400).json({ status: "Failed", data: error });
    }
}

exports.updateStatus = async (req,res)=>{
    try{
        let reqBody = req.body;
        let id = reqBody['_id'];
        let status = reqBody['status'];
        let updateDate = Date.now();

        let postBody = {
            status: status,
            updateDate: updateDate
        }
        const data = await todoListModel.updateOne({_id:id}, {$set:postBody}, {upsert: true});
        res.status(201).json({ status: "Success", data:data });

    }catch(error){
        res.status(400).json({ status: "Failed", data: error });
    }
}

exports.deleteToDo = async (req,res)=>{
    try{
        let reqBody = req.body;
        let id = reqBody['_id'];

        const data = await todoListModel.deleteOne({_id:id});
        res.status(201).json({ status: "Success", data:data });

    }catch(error){
        res.status(400).json({ status: "Failed", data: error });
    }
}

exports.readByStatus = async (req,res)=>{
    try{
    let reqBody = req.body;
    let status = reqBody['status'];
    let userName = req.headers['userName'];
    let query = {userName: userName,status:status};
    const data = await todoListModel.find(query);
    res.status(201).json({ status: "Success", data:data });

    }catch(error){
        res.status(400).json({ status: "Failed", data: error });
    }
}
exports.readByDate = async (req,res)=>{
    try{
    let reqBody = req.body;
    let toDate = reqBody['toDate'];
    let fromDate = reqBody['fromDate'];
    let userName = req.headers['userName'];

    let query = {userName: userName, createDate: {$gte: new Date(fromDate), $lte: new Date(toDate)}};
    const data = await todoListModel.find(query);
    res.status(201).json({ status: "Success", data:data });

    }catch(error){
        res.status(400).json({ status: "Failed", data: error });
    }
}