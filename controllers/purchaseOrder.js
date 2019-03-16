var PurchaseOrder = require('../models').PurchaseOrder;
var Material = require('../models').Material;

module.exports.findAll = function(req, res, next) {
   var opt = {};
   if (req.user.role === 'employee') {
      opt = {
         requestedBy: req.user._id
      };
   }
   PurchaseOrder
      .find(opt)
      .populate('job', '_id name title')
      .populate('supplier', '_id name')
      .populate('requestedBy', '_id name')
      .populate('approvedBy', '_id name')
      .sort({
         createdAt: -1
      })
      .exec(next);
};


module.exports.jobPO = function(req, res, next) {
   var opt = {
      job: req.body._id
   };
   if (req.user.role === 'employee') {
      opt.requestedBy = req.user._id;
   }
   PurchaseOrder
      .find(opt)
      .populate('job', '_id name title')
      .populate('supplier', '_id name')
      .populate('requestedBy', '_id name')
      .populate('approvedBy', '_id name')
      .exec(next);
};

module.exports.purchaseOrderInfo = function(req, res, next) {
   PurchaseOrder
      .findOne({
         _id: req.body._id
      })
      .populate('job', '_id name')
      .populate('supplier', '_id name')
      .populate('requestedBy', '_id name')
      .populate('approvedBy', '_id name')
      .exec(next);
};

module.exports.create = function(req, res, next) {
   var purchaseOrder = new PurchaseOrder();
   if (req.user.role === 'super' ||
      req.user.role === 'admin' || req.user.role === 'manager') {
      if (req.body.requestedBy) {
         purchaseOrder.requestedBy = req.body.requestedBy;
      } else {
         purchaseOrder.requestedBy = req.user._id;
      }
   } else {
      purchaseOrder.requestedBy = req.user._id;
   }
   purchaseOrder.poNumber = req.body.poNumber;
   purchaseOrder.poNumber1 = req.body.poNumber;
   purchaseOrder.reason = req.body.reason;
   purchaseOrder.remark = req.body.remark;
   purchaseOrder.totalAmount = req.body.totalAmount;
   purchaseOrder.supplier = req.body.supplier;
   purchaseOrder.job = req.body.job;
   // return purchaseOrder.save(next);
   /* unique poNumber check*/
   PurchaseOrder.count({}, function(err, c) {
      if (err) {
         console.log('error:', err);
         return next(err);
      } else if (!c) {
         // console.log('error: cannot get count');
         // return next({
         //    message: 'error retrieving the count of PO'
         // });
         c = 0;
      }
      var id = '0000' + c;
      var lastFour = id.substr(id.length - 4);
      purchaseOrder.refNo = 'PR-' + lastFour + '-' + (new Date()).getFullYear();
      // console.log('purchaseOrder.refNo', purchaseOrder.refNo);
      return purchaseOrder.save(function(e, r) {
         if (e) {
            console.log('error:', e);
            return next(e);
         }
         return next(null, purchaseOrder);
      });
   });
};

module.exports.update = function(req, res, next) {
   var opt = {
      _id: req.body._id
   };
   if (req.user.role === 'super' ||
      req.user.role === 'admin' || req.user.role === 'manager') {
      // opt.poStatus = {
      //    '$in': ['submitted']
      // };
   } else {
      opt.requestedBy = req.user._id;
      opt.poStatus = 'open';
      req.body.poStatus = 'open';
      req.body.approvedBy = null;
   }
   PurchaseOrder.findOne(opt, function(err, purchaseOrder) {
      if (err) {
         console.log('error:', err);
         return next(err);
      } else if (!purchaseOrder) {
         return next({
            message: 'No data found'
         });
      }
      purchaseOrder.poNumber = req.body.poNumber;
      purchaseOrder.poNumber1 = req.body.poNumber;
      purchaseOrder.reason = req.body.reason;
      purchaseOrder.remark = req.body.remark;
      purchaseOrder.totalAmount = req.body.totalAmount;
      purchaseOrder.supplier = req.body.supplier;
      purchaseOrder.job = req.body.job;
      purchaseOrder.requestedBy = req.body.requestedBy;
      purchaseOrder.approvedBy = req.body.approvedBy;
      purchaseOrder.poStatus = req.body.poStatus;
      // return purchaseOrder.save(next);
      /* unique poNumber check*/
      PurchaseOrder
         .findOne({
            refNo: req.body.refNo,
            _id: {
               $ne: req.body._id
            }
         })
         .exec(function(err, result) {
            if (err) {
               console.log('error:', err);
               return next(err);
            }
            if (!result) {
               return purchaseOrder.save(next);
            }
            next({
               message: req.body.refNo + " - Duplicates not allowed!"
            });
         });
   });
};

module.exports.updateTotal = function(req, res, next) {
   var opt = {
      _id: req.body._id
   };
   if (req.user.role === 'super' ||
      req.user.role === 'admin' || req.user.role === 'manager') {
      // opt.poStatus = {
      //    '$in': ['submitted']
      // };
   } else {
      opt.requestedBy = req.user._id;
      opt.poStatus = 'open';
      req.body.poStatus = 'open';
      req.body.approvedBy = null;
   }
   PurchaseOrder.findOne(opt, function(err, purchaseOrder) {
      if (err) {
         console.log('error:', err);
         return next(err);
      } else if (!purchaseOrder) {
         return next({
            message: 'No data found'
         });
      }
      purchaseOrder.totalAmount = req.body.totalAmount >= 0 ? req.body.totalAmount : purchaseOrder.totalAmount;
      purchaseOrder.save(next);
   });
};

module.exports.updatePOStatus = function(req, res, next) {
   var opt = {
      _id: req.body._id
   };
   if (req.user.role === 'super' ||
      req.user.role === 'admin' || req.user.role === 'manager') {

   } else {
      opt.requestedBy = req.user._id;
      opt.poStatus = 'open';
      req.body.poStatus = 'submitted';
      req.body.approvedBy = null;
   }
   PurchaseOrder.findOne(opt, function(err, purchaseOrder) {
      if (err) {
         console.log('error:', err);
         return next(err);
      } else if (!purchaseOrder) {
         return next({
            message: 'Illegal operation, user cannot perform this satatus change!'
         });
      }
      if (purchaseOrder.poStatus == 'submitted') {
         if (req.user.role === 'manager') {
            purchaseOrder.poStatus = 'approved';
            purchaseOrder.approvedBy = req.user._id;
         } else {
            return next({
               message: 'Illegal operation, only managers can approve!'
            });
         }
      } else if (purchaseOrder.poStatus == 'open') {
         purchaseOrder.poStatus = 'submitted';
      }
      // purchaseOrder.poStatus = req.body.poStatus;
      // purchaseOrder.approvedBy = req.body.approvedBy;
      purchaseOrder.save(function(e, r) {
         if (e) {
            console.log(e);
            return next(e);
         }
         if (purchaseOrder.poStatus == 'approved') {
            return Material.update({
               purchaseOrder: purchaseOrder._id
            }, {
               job: purchaseOrder.job,
               poNumber: purchaseOrder.poNumber,
               poNumber1: purchaseOrder.poNumber1
            }, {
               multi: true
            }, function(e, r) {
               if (e) {
                  console.log(e);
                  return next(e);
               }
               return next(null, {
                  message: 'The PR is approved'
               });
            });
         }
         return next(null, {
            message: 'Status updated'
         });
      });
   });
};

module.exports.delete = function(req, res, next) {
   var opt = {
      _id: req.body._id
   };
   if (req.user.role === 'super' || req.user.role === 'admin') {
      return next({
         message: 'Does not have delete permission'
      });
   } else if (req.user.role === 'employee') {
      opt.requestedBy = req.user._id;
      opt.poStatus = 'open';
   }
   PurchaseOrder.remove(opt, next);
};