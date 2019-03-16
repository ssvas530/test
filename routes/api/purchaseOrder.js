var express = require('express');
var router = express.Router();
var PurchaseOrder = require('../../controllers').purchaseOrder;
var Middleware = require('./middleware');

router.get('/', Middleware.isAuthenticated, function(req, res, next) {
   PurchaseOrder.findAll(req, res, function(err, purchaseOrder) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: purchaseOrder,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, function(req, res, next) {
   var save = req.body._id ? PurchaseOrder.update : PurchaseOrder.create;
   save(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: 'PurchaseOrder has been saved',
         result: dat._id,
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, function(req, res, next) {
   PurchaseOrder.delete(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'PurchaseOrder has been deleted',
         status: 200
      });
   });
});


router.post('/jobPO', Middleware.isAuthenticated, function(req, res, next) {
   PurchaseOrder.jobPO(req, res, function(err, dat) {
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

router.post('/purchaseOrderInfo', Middleware.isAuthenticated, function(req, res, next) {
   PurchaseOrder.purchaseOrderInfo(req, res, function(err, dat) {
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

router.post('/update', Middleware.isAuthenticated, function(req, res, next) {
   PurchaseOrder.update(req, res, function(err, dat) {
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

router.post('/updateTotal', Middleware.isAuthenticated, function(req, res, next) {
   PurchaseOrder.updateTotal(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         status: 200
      });
   });
});

router.post('/updatePOStatus', Middleware.isAuthenticated, function(req, res, next) {
   PurchaseOrder.updatePOStatus(req, res, function(err, dat) {
      if (err) {
         console.log(err);
         return res.status(500).send({
            message: err.message,
            status: 500
         });
      }
      return res.status(200).send({
         message: dat.message,
         status: 200
      });
   });
});

module.exports = router;
