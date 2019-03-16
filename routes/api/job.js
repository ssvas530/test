var express = require('express');
var router = express.Router();
var Job = require('../../controllers').job;
var Middleware = require('./middleware');
var path = require('path');
var mime = require('mime');
var fs = require('fs');

router.get('/', Middleware.isAuthenticated, function(req, res, next) {
   Job.findAll(req, res, function(err, job) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: job,
         status: 200
      });
   });
});

router.post('/activity', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   var save = Job.activity;
   save(req, res, function(err, dat) {
      if (err) {
         console.log('errrrrrrrrrrrrrrr:', err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: 'Job unlocked',
         status: 200
      });
   });
});

router.post('/inactivity', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   var save = Job.inActivity;
   save(req, res, function(err, dat) {
      if (err) {
         console.log('errrrrrrrrrrrrrrr:', err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: 'Job locked',
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   var save = req.body._id ? Job.update : Job.create;
   save(req, res, function(err, dat) {
      if (err) {
         console.log('errrrrrrrrrrrrrrr:', err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: 'Job has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Job.delete(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Job has been deleted',
         status: 200
      });
   });
});


router.post('/jobInfo', Middleware.isAuthenticated, function(req, res, next) {
   Job.jobInfo(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         result: dat,
         status: 200
      });
   });
});


router.get('/searchJob/:name', Middleware.isAuthenticated, function(req, res, next) {
   Job.searchJob(req, res, function(err, dat) {
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


router.post('/jobReport', Middleware.isAuthenticated, function(req, res, next) {
   Job.jobReport(req, res, function(err, dat) {
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

router.post('/download/excelReport', function(req, res) {

   Job.excelReport(req, res, function(err, file) {
      if (err) {
         return res.status(500).send({
            status: 500,
            message: 'Error while creating excel'
         });
      }
      // console.log('Sending excel');

      var filename = path.basename(file.path);
      var mimetype = mime.lookup(file.path);

      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);

      var filestream = fs.createReadStream(file.path);
      filestream.pipe(res);
   }, function(error) {
      console.log('Error Sending excel');
      res.send('ERROR:' + error);
   });

});


module.exports = router;
