var Job = require('../models').Job;
var Process = require('../models').Process;
var ProcessCtrl = require('./process');
var Promise = require('bluebird');
var Effort = require('../models').Effort;
var Material = require('../models').Material;
var Scrap = require('../models').Scrap;
var path = require('path');
var fs = require('fs');
var XLSX = require('xlsx');
var moment = require('moment');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var printMe = function(req, res, next) {
   var lte = new Date();
   var gte = new Date(2017, 1, 1);
   if (req.body && req.body.lte && req.body.gte) {
      lte = req.body.lte;
      gte = req.body.gte;
   }
   getJobDteRange(gte, lte, next);
};

module.exports.processReport = function(req, res, next) {
   // console.log('req.body', req.body);
   jobReport(req, res, next);
};

var hash = {};
var jobIds = [];
var processIds = [];

module.exports.printMe = printMe;
var getJobDteRange = function(gte, lte, next) {
   // console.log('gte', gte);
   // console.log('lte', lte);
   Job
      .find({
         createdAt: {
            $gte: gte,
            $lte: lte
         }
      })
      .sort('createdAt')
      .limit(100)
      .select('name')
      .select('code')
      .select('client')
      .select('createdAt')
      .select('startDate')
      .select('amount')
      .select('totalMaterialCost')
      .select('totalProcessCost')
      .select('poAmount')
      .populate('client', '_id name')
      .lean()
      // .populate('client', '_id name')
      .exec(function(e, r) {
         hash = {};
         jobIds = [];
         jobIds = [];
         if (e) {
            console.log(e);
            return next(e, null);
         }
         var sum = 0;
         // console.log('length', r.length);
         r.map(function(o) {
            o.totalEstCost = o.amount;
            o.totalActCost = 0;
            delete o.amount;
            hash[o._id] = o;
            // hash[o._id].material = {};
            // hash[o._id].scrap = {};
            // hash[o._id].effort = {};
            // hash[o._id].process = {};
            // jobIds.push(new mongoose.Types.ObjectId(o._id));
            jobIds.push(o._id);
         });
         // console.log('jobIds.length:', jobIds.length);
         // getMaterial(jobIds);
         // jobProcessList(jobIds);
         // getEffort(jobIds, next);
         return next(null, jobIds);
      });
};

var getMaterial = function(jobIds, next) {
   return Material
      .aggregate([{
         $match: {
            job: {
               $in: jobIds
            }
         }
      }, {
         $lookup: {
            "from": "materialtypes",
            "localField": "materialType",
            "foreignField": "_id",
            "as": "materialType"
         }
      }, {
         $unwind: {
            "path": "$materialType"
         }
      }, {
         $group: {
            _id: '$job',
            quo: {
               $sum: "$$CURRENT.quotedAmt"
            },
            act: {
               $sum: {
                  $multiply: [
                     "$$CURRENT.rate", "$$CURRENT.qty"
                  ]
               }
            }
         }
      }, {
         $project: {
            _id: '$_id',
            quo: {
               $ifNull: ["$quo", 0]
            },
            act: {
               $ifNull: ["$act", 0]
            }
         }
      }, {
         "$sort": {
            "_id": 1
         }
      }], next);
};

var jobProcessList = function(jobIds, next) {
   return Process
      .aggregate([{
         $match: {
            job: {
               $in: jobIds
            }
         }
      }, {
         $group: {
            _id: '$job',
            process: {
               $push: {
                  name: "$name",
                  rate: "$rate",
                  estamount: "$estamount"
               }
            }
         }
      }], function(e, r) {
         for (var j in r) {
            // console.log('job##', r[j]);
            var job = r[j];
            var pr = {};
            for (var p in job.process) {
               var process = job.process[p];
               // if (process.hasOwnProperty("name"))
               pr[process.name] = {
                  rate: process.rate,
                  estamount: process.estamount
               };
            }
            job.process = pr;
         }
         next(null, r);
      });
};

var getEffort = function(jobIds, next) {
   Effort
      .aggregate([{
         "$match": {
            "job": {
               "$in": jobIds
            }
         }
      }, {
         $lookup: {
            "from": "processes",
            "localField": "process",
            "foreignField": "_id",
            "as": "process"
         }
      }, {
         $unwind: {
            "path": "$process"
         }
      }, {
         "$group": {
            "_id": "$job",
            "process": {
               "$addToSet": {
                  "name": "$process.name",
                  "total": {
                     "$sum": {
                        "$divide": [{
                           "$subtract": ["$stop", "$start"]
                        }, 1000 * 60 * 60]
                     }
                  }
               }
            }
         }
      }, {
         //    "$group": {
         //       "_id": "$_id.job",
         //       "process": {
         //          "$push": "$process"
         //       }
         //    }
         // }, {
         "$sort": {
            "_id": 1
         }
      }], function(e, r) {
         for (var j in r) {
            var job = r[j];
            var pr = {};
            for (var p in job.process) {
               var process = job.process[p];
               // console.log('process##', process);
               pr[process.name] = process.total;
            }
            job.process = pr;
         }
         // console.log('job##', r[0]);
         next(null, r);
      });
};

var getScrap = function(jobIds, next) {
   Scrap
      .aggregate([{
         "$project": {
            "job": 1,
            "amount": {
               $ifNull: ["$amount", 0]
            },
         }
      }, {
         "$match": {
            "job": {
               "$in": jobIds
            }
         }
      }, {
         "$group": {
            "_id": "$job",
            "total": {
               "$sum": "$amount"
            }
         }
      }, {
         "$sort": {
            "_id": 1
         }
      }], next);
};

var getProcessIds = function(jobIds, next) {
   Effort
      .aggregate([{
         "$match": {
            "job": {
               "$in": jobIds
            }
         }
      }, {
         "$group": {
            "_id": null,
            "processIds": {
               "$addToSet": "$process"
            }
         }
      }], function(e, r) {
         processIds = [];
         // console.log('r', JSON.stringify(r));
         processIds = r[0] ? r[0].processIds : [];
         next(null, r);
      });
};


var jobReport = function(req, res, next) {
   printMe(req, res, function(e, r) {
      if (e) {
         console.log(e);
         return next(e, null);
      }
      Promise.map([getMaterial, jobProcessList, getEffort, getScrap], function(fn) {
            return new Promise(function(resolve, reject) {
               fn(r, function(e, r) {
                  if (e) {
                     console.log(e);
                     return reject(e);
                  }
                  resolve(r);
               });
            });
         })
         .then(function(compJobInfo) {
            compJobInfo[0].map(function(o) {
               hash[o._id].material = {
                  quo: o.quo,
                  act: o.act
               };
            });
            compJobInfo[1].map(function(o) {
               hash[o._id].process = o.process;
            });
            compJobInfo[2].map(function(o) {
               for (var key in o.process) {
                  // console.log('key', key);
                  // console.log('o', JSON.stringify(o));
                  if (hash[o._id].process && hash[o._id].process.hasOwnProperty(key)) {
                     hash[o._id].process[key].total = o.process[key];
                  }
               }
            });
            compJobInfo[3].map(function(o) {
               hash[o._id].scrap = o.total;
            });
            getProcessIds(jobIds, function(e, r) {
               if (e) {
                  console.log(e);
                  return next(e, r);
               }
               defaultJobProcessList(jobIds, function(e, r) {
                  if (e) {
                     console.log(e);
                     return next(e, r);
                  }
                  hash.defaultProcess = r[0] ? r[0].process : [];
                  next(null, hash);
               });
            });
         })
         .catch(function(e) {
            next(e, null);
         });
   });

};

var defaultJobProcessList = function(jobIds, next) {
   return Process
      .aggregate([{
         $match: {
            job: {
               $in: jobIds
            },
            _id: {
               $in: processIds
            }
         }
      }, {
         $group: {
            "_id": "null",
            "process": {
               "$addToSet": "$name"
            }
         }
      }], next);
};


module.exports.excelReport = function(req, res, next) {
   defaultJobProcessList(jobIds, function(e, r) {
      if (e) {
         console.log(e);
         return next(e, r);
      }
      // console.log('r2r', r[0].process);
   });

};

module.exports.jobReport = jobReport;
