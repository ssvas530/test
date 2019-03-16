var express = require('express');
var router = express.Router();
var ProductPurchase = require('../../controllers').productPurchase;
var Middleware = require('./middleware');

router.get('/', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   ProductPurchase.findAll(req, res, function(err, productPurchase) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: productPurchase,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, function(req, res, next) {
   var save = req.body._id ? ProductPurchase.update : ProductPurchase.create;
   save(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: 'ProductPurchase has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, function(req, res, next) {
   ProductPurchase.delete(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'ProductPurchase has been deleted',
         status: 200
      });
   });
});


router.post('/poProduct', Middleware.isAuthenticated, function(req, res, next) {
   ProductPurchase.poProduct(req, res, function(err, dat) {
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
   ProductPurchase.update(req, res, function(err, dat) {
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
