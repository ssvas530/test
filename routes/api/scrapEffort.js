var express = require('express');
var router = express.Router();
var ScrapEffort = require('../../controllers').scrapEffort;
var Middleware = require('./middleware');

router.get('/', Middleware.isAuthenticated, function(req, res, next) {
   ScrapEffort.findAll(req, res, function(err, scrapEffort) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: scrapEffort,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, function(req, res, next) {
   var save = req.body._id ? ScrapEffort.update : ScrapEffort.create;
   save(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: 'ScrapEffort has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, function(req, res, next) {
   ScrapEffort.delete(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'ScrapEffort has been deleted',
         status: 200
      });
   });
});


router.post('/jobScrapEffort', Middleware.isAuthenticated, function(req, res, next) {
   ScrapEffort.jobScrapEffort(req, res, function(err, dat) {
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


router.post('/update', Middleware.isAuthenticated, function(req, res, next) {
   ScrapEffort.update(req, res, function(err, dat) {
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
