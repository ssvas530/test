var Material = require('../models').Material;

module.exports.findAll = function(req, res, next) {
   Material
      .find({})
      .exec(next);
};


module.exports.jobMaterial = function(req, res, next) {
   Material
      .find({
         job: req.body._id
      })
      .populate('purchaseOrder', '_id name poNumber')
      .populate('materialType', '_id name')
      .populate('supplier', '_id name')
      .exec(next);
};

module.exports.create = function(req, res, next) {
   var material = new Material();
   material.name = req.body.name;
   material.name1 = req.body.name;
   material.poNumber = req.body.poNumber;
   material.poNumber1 = req.body.poNumber;
   material.qty = req.body.qty;
   material.rate = req.body.rate;
   material.amount = req.body.amount;
   material.materialType = req.body.materialType;
   material.date = req.body.date;
   material.supplier = req.body.supplier;
   material.job = req.body.job;
   material.purchaseOrder = req.body.purchaseOrder;
   material.created = req.body.created;
   //return material.save(next); /* unique poNumber check is bypassed*/
   if (!req.body._opt) {
      return material.save(next);
   }
   Material
      .findOne(req.body._opt)
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         if (!result) {
            return material.save(next);
         }
         next({
            message: req.body.name + " - Duplicates not allowed!"
         });
      });
};

module.exports.update = function(req, res, next) {
   Material.findById(req.body._id, function(err, material) {
      if (err) {
         console.log('error:', err);
         return next(err);
      }
      material.name = req.body.name;
      material.name1 = req.body.name;
      material.qty = req.body.qty;
      material.rate = req.body.rate;
      material.amount = req.body.amount;
      material.materialType = req.body.materialType;
      material.date = req.body.date;
      material.supplier = req.body.supplier;
      material.poNumber = req.body.poNumber;
      material.poNumber1 = req.body.poNumber;
      material.created = req.body.created;
      material.purchaseOrder = req.body.purchaseOrder;
      material.job = req.body.job;
      //return material.save(next); /* unique poNumber check is bypassed*/
      if (!req.body._opt) {
         return material.save(next);
      }
      Material
         .findOne(req.body._opt)
         .exec(function(err, result) {
            if (err) {
               console.log('error:', err);
               return next(err);
            }
            if (!result) {
               return material.save(next);
            }
            next({
               message: req.body.name + " - Material with same name already exists!"
            });
         });
   });
};

module.exports.delete = function(req, res, next) {
   Material.remove({
      _id: req.body._id
   }, next);
};
