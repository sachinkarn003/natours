const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
//const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRouters');
const userRouter = require('./routes/userRouters');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers.js/errorController');
const reviewRouter = require('./routes/reviewRouter');
const bookingRouter = require('./routes/bookingRouter');
const viewRouter = require('./routes/viewRouter');
const app = express();

app.set('view engine','pug');
app.set('views',path.join(__dirname, 'views'))

//1)GLOBAL MIDDLEWARE FUNCTION

//Serving static files
//app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP headers
//app.use(helmet());

//Development logging 
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Limit request from API
const limiter = rateLimit({
max:100,
windowMs:60*60*1000,
message:'Too many requrests from this IP, please try again in an hour!'
});

app.use('/api',limiter);

// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'})); 
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
 app.use(hpp({
   whitelist:['duration','ratingsAverage','ratingsQuantity','maxGroupSize','difficulty','price']
 }));

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies)
  next();
});


// 3) ROUTES

// app.get('/api/v1/tours',getAllTours);

// app.get('/api/v1/tours/:id',getTour);

// app.post('/api/v1/tours',CreatTour);

// app.patch('/api/v1/tours/:id',updateTour);

// app.delete('/api/v1/tours/:id',deleteTour);

  app.use('/',viewRouter);
  app.use('/api/v1/tours',tourRouter);
  app.use('/api/v1/users',userRouter); 
  app.use('/api/v1/reviews',reviewRouter); 
  app.use('/api/v1/booking',bookingRouter); 

  app.all('*',(req,res,next)=>{ 
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError(`Can't find ${req.originalUrl} on this server`,404)); //it will send argument to next middlware
  });

  app.use(globalErrorHandler);
//START SERVER
module.exports = app;
