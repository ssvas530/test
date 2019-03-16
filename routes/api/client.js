var express = require('express');
var router = express.Router();
var Client = require('../../controllers').client;
var Middleware = require('./middleware');

router.get('/', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Client.findAll(req, res, function(err, client) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: client,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   var save = req.body._id ? Client.update : Client.create;
   save(req, res, function(err, dat) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Client has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Client.delete(req, res, function(err, dat) {
      if (err) {
         return res.status(500).send(err);
      }
      console.log(dat);
      return res.status(200).send({
         message: 'Customer has been deleted',
         status: 200
      });
   });
});


router.get('/clientList', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Client.clientList(req, res, function(err, dat) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: dat,
         status: 200
      });
   });
});

module.exports = router;
