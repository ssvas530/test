var ProductPurchase = require('../models').Material;
var Material = require('./material');
var MaterialType = require('./materialT');
module.exports.findAll = function(req, res, next) {
   ProductPurchase
      .find({})
      .exec(next);
};

module.exports.poProduct = function(req, res, next) {
   ProductPurchase
      .find({
         purchaseOrder: req.body._id
      })
      .populate('purchaseOrder', '_id name')
      .populate('materialType', '_id name')
      .populate('supplier', '_id name')
      .exec(next);
};

module.exports.create = function(req, res, next) {
   // console.log('req.body', req.body);
   delete req.body.job;
   if (!req.body.materialType._id) {
      // create a master materialType
      // req.body._opt = {
      //    purchaseOrder: req.body.purchaseOrder,
      //    supplier: req.body.supplier,
      //    name1: req.body.name.toLowerCase(),
      //    _id: {
      //       $ne: req.body._id
      //    }
      // };
      var materialTypeData = {
         body: {}
      };
      materialTypeData.body = JSON.parse(JSON.stringify(req.body.materialType));
      return MaterialType.create(materialTypeData, res, function(e, r) {
         if (e) {
            console.log(e);
            return next(e);
         }
         req.body.materialType = r._id;
         return Material.create(req, res, function(e, r) {
            if (e) {
               console.log(e);
               return next(e);
            }
            return next(null, r);
         });
      });
   }
   return Material.create(req, res, function(e, r) {
      if (e) {
         console.log(e);
         return next(e);
      }
      return next(null, r);
   });
};

module.exports.update = function(req, res, next) {
   delete req.body.job;
   return Material.update(req, res, function(e, r) {
      if (e) {
         console.log(e);
         return next(e);
      }
      return next(null, r);
   });
};

module.exports.delete = function(req, res, next) {
   return Material.delete(req, res, function(e, r) {
      if (e) {
         console.log(e);
         return next(e);
      }
      return next(null, r);
   });
};
