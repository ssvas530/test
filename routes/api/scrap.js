var express = require('express');
var router = express.Router();
var Scrap = require('../../controllers').scrap;
var Middleware = require('./middleware');

router.get('/', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Scrap.findAll(req, res, function(err, scrap) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: scrap,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   var save = req.body._id ? Scrap.update : Scrap.create;
   save(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: 'Scrap has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Scrap.delete(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Scrap has been deleted',
         status: 200
      });
   });
});


router.post('/jobScrap', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Scrap.jobScrap(req, res, function(err, dat) {
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


router.post('/update', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Scrap.update(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: 'Updated',
         status: 200
      });
   });
});


module.exports = router;
