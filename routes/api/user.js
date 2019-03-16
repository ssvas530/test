var express = require('express');
var router = express.Router();
var User = require('../../controllers').user;
var Middleware = require('./middleware');

router.get('/', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   User.findAll(req, res, function(err, users) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: users,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   var save = req.body._id ? User.update : User.create;
   save(req, res, function(err, user) {
      if (err) {
         console.log('error:', err);
         return res.status(500).send({
            message: err.message
         });
      }
      return res.status(200).send({
         message: 'User has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   User.delete(req, res, function(err, user) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'User has been deleted',
         status: 200
      });
   });
});


router.get('/searchEmp/:name', Middleware.isAuthenticated, function(req, res, next) {
   User.searchEmp(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: dat,
         status: 200
      });
   });
});

router.get('/ping', Middleware.isAuthenticated, function(req, res) {
   console.log('############### user', req.user);
   return res.status(200).send({
      result: req.user,
      status: 200
   });
});


module.exports = router;
