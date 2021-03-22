// requiring express module
const express = require('express');
// requiring tourController module
const tourController = require('./../controllers/tourController');
// requiring authController module
const authController = require('./../controllers/authController');
// requiring reviewController module
const reviewRouter = require('./../routes/reviewRoutes');

// Defining the router
const router = express.Router();

// This is a middleware that checks if we want the reviews for
// a specific route and takes us to the reviewRouter
router.use('/:tourId/reviews', reviewRouter);

// This route gives us the 5 cheapest tours
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// This route gives us the statistics about the best tours
// which have over 4.5 rating average
router.route('/tour-stats').get(tourController.getTourStats);

// This route gives ust the monthly statistics for a specific year
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

// This is a route that calculate for us the closest tours within
// a distance, a center point in lat & lng and the unit (mi, km)
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

// This route calculates for us the distances to all the tours,
// we have to specify the center point in lat & lng (our position on the map)
// and the unit(mi, km)
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours) // this route gives us all the tours
  .post(
    // this endpoint lets us to create a tour only if u are an admin or a lead guide
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour) // this route gives us a specific tour by its id
  .patch(
    // this route allow us to update a specific tour only if u are an admin or a lead guide
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.reziseTourImages,
    tourController.updateTour
  )
  .delete(
    // this route allow us to delete a specific tour only if u are an admin or a lead guide
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// Exporting the module
module.exports = router;
