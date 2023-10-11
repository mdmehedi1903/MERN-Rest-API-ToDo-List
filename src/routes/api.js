const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController')
const todoListController = require('../controllers/todoListController')
const authVerify = require('../middleware/authVerify')

// User Registration and Manage
router.post('/create-profile', profileController.createProfile)
router.get('/user-login', profileController.userLogin)
router.get('/read-profile', authVerify, profileController.readProfile)
router.post('/update-profile', authVerify, profileController.updateProfile)
router.delete('/delete-profile/', authVerify, profileController.deleteProfile)

// Password Reseting : No need middleware as user unable to login until reset password! becuse he forgot password!
router.get('/send-otp', profileController.sendOTP) // Query Params
router.get('/verify-otp/:email/:otp', profileController.verifyOTP) // URL Params
router.post('/reset-password', profileController.resetPassword) 

// ToDo Create and Manage
router.post('/create-todo', authVerify, todoListController.createTodoList)
router.get('/read-todo', authVerify, todoListController.readTodolist)
router.post('/update-todo', authVerify, todoListController.updateTodolist)
router.post('/update-status', authVerify, todoListController.updateStatus)
router.get('/delete-todo', authVerify, todoListController.deleteToDo)
router.post('/read-by-status', authVerify, todoListController.readByStatus)
router.get('/read-by-date', authVerify, todoListController.readByDate)


module.exports = router;  