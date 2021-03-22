// requiring express module
const express = require('express');
// requiring userController module
const userController = require('./../controllers/userController');
// requiring authController module
const authController = require('./../controllers/authController');

// Defining the router
const router = express.Router();

// SINGUP ROUTE
router.post('/signup', authController.signup);
// LOGIN ROUTE
router.post('/login', authController.login);
// LOGOUT ROUTE
router.get('/logout', authController.logout);
// this route will allow us to recover our password
router.post('/forgotPassword', authController.forgotPassword);
// this route will allow us to reset our password
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

// this route will allow us to update our password
router.patch('/updateMyPassword', authController.updatePassword);
// this route will return us all the information about the current user u are loged in
router.get('/me', userController.getMe, userController.getUser);
// this route will allow us to update the current user information
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhote,
  userController.updateMe
);
// this route will allow us delete the current user
router.delete('/deleteMe', userController.deleteMe);

// Restrict all the following routes just for the admin users
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers) // this route returns us all the users
  .post(userController.createUser); // this route allows us to create an user

router
  .route('/:id')
  .get(userController.getUser) // this route returns the user by its id specified in the endpoint
  .patch(userController.updateUser) // this route allows us to update a specific user
  .delete(userController.deleteUser); // this route allows us to delete a specific user

// Exporting the module
module.exports = router;
