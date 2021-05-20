const express = require('express');
const reviewController = require('./../Controllers.js/reviewController');
const authController = require('./../Controllers.js/authController');

const router = express.Router({mergeParams: true});

// POST /tours/234sdfa/reviews or
// POST /reviews
 router.use(authController.protect);

router.route('/').get(reviewController.getAllReviews)
.post(
authController.restrictTo('user'),
reviewController.setTourUserIds,
reviewController.createReview
);

router.route('/:id')
.get(reviewController.getReview) 
.patch(authController.restrictTo('user','admin'), reviewController.updateReview)
.delete(authController.restrictTo('user','admin'),reviewController.deleteReview);

module.exports = router;
