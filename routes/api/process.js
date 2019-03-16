var express = require('express');
var router = express.Router();
var Process = require('../../controllers').process;
var Middleware = require('./middleware');

router.get('/', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Process.findAll(req, res, function(err, process) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: process,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   var save = req.body._id ? Process.update : Process.create;
   save(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: 'Process has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Process.delete(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Process has been deleted',
         status: 200
      });
   });
});


router.post('/jobProcess', Middleware.isAuthenticated, function(req, res, next) {
   Process.jobProcess(req, res, function(err, dat) {
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


router.get('/searchJobProcess/:name', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Process.searchJobProcess(req, res, function(err, dat) {
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

router.post('/addJobProcess', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Process.addJobProcess(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: 'Process added',
         status: 200
      });
   });
});

router.post('/updateJobProcess', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Process.updateJobProcess(req, res, function(err, dat) {
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

router.post('/deleteJobProcess', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Process.deleteJobProcess(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: 'process deleted from job',
         status: 200
      });
   });
});

module.exports = router;
