var ScrapEffort = require('../models').ScrapEffort;

module.exports.findAll = function(req, res, next) {
   ScrapEffort
      .find({})
      .populate('job', '_id name')
      .exec(next);
};


module.exports.jobScrapEffort = function(req, res, next) {
   ScrapEffort
      .find({
         job: req.body._id
      })
      .populate('job', '_id name')
      .exec(next);
};

module.exports.create = function(req, res, next) {
   var effort = new ScrapEffort();
   effort.job = req.body.job;
   effort.partNo = req.body.partNo;
   effort.remarks = req.body.remarks;
   effort.totalEffortCost = req.body.totalEffortCost;
   effort.totalQty = req.body.totalQty;
   effort.scrapQty = req.body.scrapQty;
   effort.scrapCost = req.body.scrapCost;
   ScrapEffort
      .findOne({
         job: req.body.job,
         partNo: req.body.partNo
      })
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         if (!result) return effort.save(next);
         next({
            message: req.body.partNo + " - already exists!"
         });
      });
};

module.exports.update = function(req, res, next) {
   ScrapEffort
      .findById(req.body._id, function(err, effort) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         effort.partNo = req.body.partNo;
         effort.remarks = req.body.remarks;
         effort.totalEffortCost = req.body.totalEffortCost;
         effort.totalQty = req.body.totalQty;
         effort.scrapQty = req.body.scrapQty;
         effort.scrapCost = req.body.scrapCost;
         effort.save(next);
      });
};

module.exports.delete = function(req, res, next) {
   ScrapEffort
      .remove({
         _id: req.body._id
      }, next);
};
