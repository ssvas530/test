var express = require('express');
var router = express.Router();
var passport = require('passport');
var Middleware = require('./middleware');
var Feedback = require('../controllers').feedback;
var Airline = require('../controllers').airline;
var User = require('../controllers').user;
var Longe = require('../controllers').longe;

router.get('/login', function(req, res) {
   res.render('login', {
      user: req.user
   });
});

router.post('/home', passport.authenticate('local'), function(req, res) {
   console.log(req.body);
   res.render('home');
});

router.get('/logout', function(req, res) {
   req.logout();
   res.redirect('/login');
});

router.get('/', Middleware.isAuthenticated, function(req, res) {
   if (req.user.role === 'feedback')
      return res.redirect('/feedback');
   res.render('home');
});


router.get('/feedback', Middleware.isAuthenticated, function(req, res) {
   res.render('feedback');
});


// router.post('/feedbackform', Middleware.isAuthenticated, Middleware.isFeedbackUser, function(req, res) {
//    Feedback.save(req, res, function(err, questions) {
//       res.redirect('/feedback');
//    });
// });


module.exports = router;
