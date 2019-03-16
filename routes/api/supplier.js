var express = require('express');
var router = express.Router();
var Supplier = require('../../controllers').supplier;
var Middleware = require('./middleware');

router.get('/', Middleware.isAuthenticated, function(req, res, next) {
   Supplier.findAll(req, res, function(err, suppliers) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: suppliers,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   var save = req.body._id ? Supplier.update : Supplier.create;
   save(req, res, function(err, dat) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Supplier has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Supplier.delete(req, res, function(err, dat) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Supplier has been deleted',
         status: 200
      });
   });
});



router.get('/list', Middleware.isAuthenticated, function(req, res, next) {
   Supplier.list(req, res, function(err, dat) {
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
