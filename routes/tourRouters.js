const express = require('express');

const tourControllers = require('./../Controllers.js/tourController');

const authControllers = require('./../Controllers.js/authController');

const reviewRouter = require('./../routes/reviewRouter');

const router = express.Router();

// router.param('id',tourControllers.checkID);

// POST /tour/234dfs/reviews

// GET /tour/234fad4/reviews

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getTourStats);

router.route('/montly-plan/:year')
.get(
authControllers.protect,
authControllers.restrictTo('admin','lead-guide','guide'),
tourControllers.monthlyPlan
);

router
.route('/tours-within/:distance/center/:latlng/unit/:unit')
.get(tourControllers.getToursWithin)
//  /tours-within?distance=233&center=-40,45&unit=mi
//  /tour-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourControllers.getDistances);
router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(authControllers.protect,
  authControllers.restrictTo('admin','lead-guide'),
  tourControllers.CreatTour
  );

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(authControllers.protect,
  authControllers.restrictTo('admin','lead-guide'),
  tourControllers.uploadTourImages,
  tourControllers.resizeTourImages,
  tourControllers.updateTour
  )
  .delete(authControllers.protect,
  authControllers.restrictTo('admin','lead-guide'), 
  tourControllers.deleteTour
  );


module.exports = router;
