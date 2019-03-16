var Supplier = require('../models').Supplier;

module.exports.findAll = function(req, res, next) {
   Supplier.find({}, next);
};

module.exports.create = function(req, res, next) {
   var supplier = new Supplier();
   supplier.name = req.body.name;
   supplier.name1 = req.body.name;
   supplier.detail = req.body.detail;
   Supplier
      .findOne({
         name1: req.body.name.toLowerCase()
      })
      .exec(function(err, result) {
         if (err) return next(err);
         if (!result) return supplier.save(next);
         next({
            message: req.body.name + " - supplier already exists!"
         });
      });
};

module.exports.update = function(req, res, next) {
   Supplier.findById(req.body._id, function(err, supplier) {
      if (err) {
         console.log('error:', err);
         return next(err);
      }
      supplier.name = req.body.name;
      supplier.name1 = req.body.name;
      supplier.detail = req.body.detail;
      supplier.save(next);
   });
};

module.exports.delete = function(req, res, next) {
   Supplier.remove({
      _id: req.body._id
   }, next);
};


module.exports.list = function(req, res, next) {
   Supplier.find({})
      .select('name')
      .exec(next);
};
