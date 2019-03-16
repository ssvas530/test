var express = require('express');
var router = express.Router();
var Product = require('../../controllers').productMaster;
var Middleware = require('./middleware');

router.get('/', Middleware.isAuthenticated, function(req, res, next) {
   Product.findAll(req, res, function(err, product) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: product,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   var save = req.body._id ? Product.update : Product.create;
   save(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: 'Product has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Product.delete(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Product has been deleted',
         status: 200
      });
   });
});

router.get('/searchProduct/:name', Middleware.isAuthenticated, function(req, res, next) {
   Product.searchProduct(req, res, function(err, dat) {
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
