var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../../models').User;
var middleware = require('./middleware');

/* GET users listing. */
router.get('/login', function(req, res, next) {
   res.send('respond with a resource');
});
router.post('/login', passport.authenticate('local'), function(req, res) {
   if (!req.user) {
      return res.status(500).send({
         error: new Error('Invalid username or password'),
         status: 500
      });
   }
   return res.status(200).send({
      result: 'User has logged in successfully',
      status: 200
   });
});

router.get('/logout', function(req, res) {
   req.logout();
   res.status(200).send({
      message: 'User has logged out successfully',
      status: 200
   });
});

router.get('/ping', middleware.isAuthenticated, function(req, res) {
   res.status(200).send({
      result: req.user,
      status: 200
   });
});

module.exports = router;
