// requiring express module
const express = require("express");
// requiring reviewController module
const reviewController = require("./../controllers/reviewController");
// requiring authController module
const authController = require("./../controllers/authController");

// Defining the router
const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews) // this route returns us all the reviews
  .post(
    // this route allows us to create a review
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview) // this route returns us a specific review - we have to specify in the url the review's id
  .patch(
    // this route allows us to update a specific review - we have to specify in the url the review's id
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    // this route allows us to delete a specific review - we have to specify in the url the review's id\
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

// Exporting the module
module.exports = router;
