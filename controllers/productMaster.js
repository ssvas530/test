var ProductMaster = require('../models').ProductMaster;
var MaterialType = require('../models').MaterialT;
module.exports.findAll = function(req, res, next) {
   MaterialType.find({}, next);
};

module.exports.create = function(req, res, next) {
   var productMaster = new ProductMaster();
   productMaster.name = req.body.name;
   productMaster.name1 = req.body.name;
   productMaster.description = req.body.description;
   ProductMaster
      .findOne({
         name1: req.body.name.toLowerCase()
      })
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         if (!result) return productMaster.save(function(e, r) {
            if (e) {
               console.log(e);
               return next(e);
            }
            return next(null, r);
         });
         next({
            message: req.body.name + " - productMaster already exists!"
         });
      });
};

module.exports.update = function(req, res, next) {
   ProductMaster.findById(req.body._id, function(err, productMaster) {
      if (err) return next(err);
      productMaster.name = req.body.name;
      productMaster.name1 = req.body.name;
      productMaster.description = req.body.description;
      productMaster.save(next);
   });
};

module.exports.delete = function(req, res, next) {
   ProductMaster.findByIdAndRemove(req.body._id, next);
};

module.exports.searchProduct = function(req, res, next) {
   var searchCriteria = {
      $or: [{
         name: {
            '$regex': req.params.name.toString(),
            '$options': 'i'
         }
      }, {
         detail: {
            '$regex': req.params.name.toString(),
            '$options': 'i'
         }
      }]
   };

   MaterialType
      .find(searchCriteria)
      .exec(next);
};
