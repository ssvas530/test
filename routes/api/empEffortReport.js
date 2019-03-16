var express = require('express');
var router = express.Router();
var Effort = require('../../controllers').empEffortReport;
var Middleware = require('./middleware');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var Batch = require('../../models').Batch;
var cp = require('child_process');
// router.get('/', function(req, res, next) {
//    Effort.printMe(req, res, function(err, effort) {
//       if (err) {
//          console.log(err);
//          return res.status(500).send(err);
//       }
//       return res.status(200).send({
//          result: effort,
//          status: 200
//       });
//    });
// });

router.post('/', Middleware.isAuthenticated, function(req, res, next) {
   // return Effort.printMe(req, res, function(err, effort) {
   //    if (err) {
   //       console.log(err);
   //       return res.status(500).send(err);
   //    }
   //    return res.status(200).send({
   //       message: effort.message,
   //       result: effort,
   //       status: 200
   //    });
   // });
   childProcess = cp.fork(__dirname + '/../../processes/' + 'generateEmpEffExcel.js');
   childProcess.on('message', function(msg) {
      if (msg.error) {
         console.log(msg);
         return res.status(500).send({
            message: msg.message
         });
      }
      return res.status(200).send({
         message: msg.message,
         result: [],
         status: 200
      });
   });
   childProcess.on('exit', function(code, signal) {
      console.log('Child exited:', code, signal);
   });
   return childProcess.send({
      body: req.body
   });
   return;
   Batch
      .findOne({
         status: 'running'
      })
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         if (!result) {
            childProcess = cp.fork(__dirname + '/../../processes/' + 'generateEmpEffExcel.js');
            childProcess.on('message', function(msg) {
               if (msg.error) {
                  console.log(err);
                  return res.status(500).send({
                     message: msg.message
                  });
               }
               return res.status(200).send({
                  message: msg.message,
                  result: [],
                  status: 200
               });
            });
            childProcess.on('exit', function(code, signal) {
               console.log('Child exited:', code, signal);
            });
            return childProcess.send({
               body: req.body
            });
         }
         return res.status(500).send({
            message: 'A batch is in progress. Please wait for its completion',
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

router.post('/batch/download', function(req, res) {
   Effort.downloadFile(req, res, function(err, file) {
      if (err) {
         return res.status(500).send({
            status: 500,
            message: 'Error while creating excel'
         });
      }
      return res.download(file.path);
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

router.get('/batch/info', function(req, res, next) {
   Effort.getBatchInfo(req, res, function(err, effort) {
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

module.exports = router;