// requiring express module
const express = require('express');
// requiring reviewController module
const bookingController = require('./../controllers/bookingController');
// requiring authController module
const authController = require('./../controllers/authController');
const Booking = require('../models/bookingModel');

// Defining the router
const router = express.Router();

router.use(authController.protect);

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
