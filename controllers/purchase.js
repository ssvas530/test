var Purchase = require('../models').Purchase;

module.exports.findAll = function(req, res, next) {
   Purchase
      .find()
      .exec(next);
};

module.exports.create = function(req, res, next) {
   var purchase = new Purchase();
   purchase.ponumber = req.body.ponumber;
   purchase.quantity = req.body.quantity;
   purchase.product = req.body.product;
   purchase.invoiceamount = req.body.invoiceamount;
    Purchase
      .findOne({
         ponumber: req.body.ponumber.toLowerCase()
      })
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         if (!result) return purchase.save(next);
         next({
            message: req.body.ponumber + " - purchase already exists!"
         });
      });
};

module.exports.update = function(req, res, next) {
   Purchase.findById(req.body._id, function(err, purchase) {
      if (err) return next(err);
      purchase.ponumber = req.body.ponumber;
       purchase.product = req.body.product;
       purchase.quantity = req.body.quantity;
       purchase.invoiceamount = req.body.invoiceamount;
       purchase.save(next);
   });
};

module.exports.delete = function(req, res, next) {
   Purchase.remove({
         _id: req.body._id
      })
      .exec(next);
};



