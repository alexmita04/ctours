// requiring path module
const path = require('path');
// requiring express module
const express = require('express');
// requiring morgan module
const morgan = require('morgan');
// requiring rateLimit module
const rateLimit = require('express-rate-limit');
// requiring helmet module
const helmet = require('helmet');
// requiring mongoSanitize module
const mongoSanitize = require('express-mongo-sanitize');
// requiring xss module
const xss = require('xss-clean');
// requiring hpp module
const hpp = require('hpp');
// requiring cookie-parser module
const cookieParser = require('cookie-parser');
const csp = require('express-csp');
const compression = require('compression');
const cors = require('cors');

// requiring the AppError
const AppError = require('./utils/appError');
// requiring the globalErrorHandler
const globalErrorHandler = require('./controllers/errorController');
// requiring the tour router
const tourRouter = require('./routes/tourRoutes');
// requiring the user router
const userRouter = require('./routes/userRoutes');
// requiring the review router
const reviewRouter = require('./routes/reviewRoutes');
// requiring the booking router
const bookingRouter = require('./routes/bookingRoutes');
// requiring the view router
const viewRouter = require('./routes/viewRoutes');

// Initializing the application!
const app = express();

app.enable('trust proxy');

// setting the view engine to pug which is integrated in the express module
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Initializing CORS
app.use(cors());

app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers --
// Helmet helps you secure your express apps by
// setting various HTTP headers
app.use(helmet());
csp.extend(app, {
  policy: {
    directives: {
      'default-src': ['self'],
      'style-src': ['self', 'unsafe-inline', 'https:'],
      'font-src': ['self', 'https://fonts.gstatic.com'],
      'script-src': [
        'self',
        'unsafe-inline',
        'data',
        'blob',
        'https://js.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:8828',
        'ws://localhost:56558/',
      ],
      'worker-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
      'frame-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
      'img-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
      'connect-src': [
        'self',
        'unsafe-inline',
        'data:',
        'blob:',
        'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
        'https://*.stripe.com',
        'https://*.mapbox.com',
        'https://*.cloudflare.com/',
        'https://bundle.js:*',
        'ws://localhost:*/',
      ],
    },
  },
});

// Development logging
// We check if the app is in development so that
// we get the morgan result in the terminal
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
// We limit the requests from the same
// ip address in order to prevent the app crush
const limiter = rateLimit({
  // initializing the limiter
  max: 100, // max 100 requests
  windowMs: 60 * 60 * 1000, // 1h translated in miliseconds
  message: 'Too many requests from this IP, please try again in an hour!', // the error message
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
// We parse the incoming req in a middleware before the handlers are executed
// available under the req.body property
app.use(express.json({ limit: '10kb' })); // limiting the req size to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS (cross site scripting)
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  // adding a requestTime property to the req object
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
// VIEW ROUTER
app.use('/', viewRouter);
// TOUR ROUTER
app.use('/api/v1/tours', tourRouter);
// USER ROUTER
app.use('/api/v1/users', userRouter);
// REVIEW ROUTER
app.use('/api/v1/reviews', reviewRouter);
// BOOKING ROUTER
app.use('/api/v1/bookings', bookingRouter);

// If we got to this point it means that there is no routes
// for the certain url
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Sending the errors to the globalErrorHandler
app.use(globalErrorHandler);

// Exporting the app module
module.exports = app;
