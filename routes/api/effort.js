var express = require('express');
var router = express.Router();
var Effort = require('../../controllers').effort;
var Middleware = require('./middleware');
var path = require('path');
var mime = require('mime');
var fs = require('fs');

router.get('/', Middleware.isAuthenticated, function(req, res, next) {
   Effort.findAll(req, res, function(err, effort) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: effort,
         status: 200
      });
   });
});

router.post('/partNo', Middleware.isAuthenticated, function(req, res, next) {
   Effort.partNo(req, res, function(err, effort) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: effort,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, function(req, res, next) {
   var save = req.body._id ? Effort.update : Effort.create;
   save(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: 'Effort has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, function(req, res, next) {
   Effort.delete(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Effort has been deleted',
         status: 200
      });
   });
});


router.post('/jobEffort', Middleware.isAuthenticated, function(req, res, next) {
   Effort.jobEffort(req, res, function(err, dat) {
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


router.post('/jobEffortFindOne', Middleware.isAuthenticated, function(req, res, next) {
   Effort.jobEffortFindOne(req, res, function(err, dat) {
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

router.post('/totalEffortCost', Middleware.isAuthenticated, function(req, res, next) {
   Effort.totalEffortCost(req, res, function(err, dat) {
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
   Effort.update(req, res, function(err, dat) {
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


router.post('/effortReport', Middleware.isAuthenticated, function(req, res, next) {
   Effort.effortReport(req, res, function(err, dat) {
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

   Effort.excelReport(req, res, function(err, file) {
      if (err) {
         return res.status(500).send({
            status: 500,
            message: 'Error while creating excel'
         });
      }
      console.log('Sending excel');

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
