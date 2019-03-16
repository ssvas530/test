var express = require('express');
var router = express.Router();
var MaterialT = require('../../controllers').materialT;
var Middleware = require('./middleware');

router.get('/', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   MaterialT.findAll(req, res, function(err, materialT) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: materialT,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   var save = req.body._id ? MaterialT.update : MaterialT.create;
   save(req, res, function(err, dat) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Material Type has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   MaterialT.delete(req, res, function(err, dat) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Material Type has been deleted',
         status: 200
      });
   });
});



router.get('/list', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   MaterialT.list(req, res, function(err, dat) {
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

module.exports = router;
