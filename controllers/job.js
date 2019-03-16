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
module.exports.findAll = function(req, res, next) {
   var obj = {};
   if (req.user.role == 'employee') {
      obj.activity = 'active';
      obj.startDate = {
         $lte: new Date()
      };
   }
   Job
      .find(obj)
      .populate('client', '_id name')
      .exec(next);
};

module.exports.create = function(req, res, next) {
   var job = new Job();
   job.code = req.body.code;
   job.code1 = req.body.code;
   job.name = req.body.name;
   job.amount = req.body.amount;
   job.comment = req.body.comment;
   job.client = req.body.client;
   job.startDate = req.body.startDate;
   job.totalMaterialCost = req.body.totalMaterialCost;
   job.totalProcessCost = req.body.totalProcessCost;
   job.poAmount = req.body.poAmount;
   Job
      .findOne({
         code1: req.body.code.toLowerCase()
      })
      .exec(function(err, result) {
         if (err) {
            console.log('error finding job before save : ', err);
            return next(err);
         }
         if (!result)
            return job.save(function(e, savedJob) {
               if (e) {
                  console.log('error saving job : ', e);
                  return next({
                     message: e.message
                  }, null);
               }
               Process.find({
                     master: true,
                     default: true
                  })
                  .exec(function(e, r) {
                     if (e) {
                        console.log(
                           'error finding default processes : ',
                           e);
                     }
                     Promise.map(r, function(i) {
                           return new Promise(function(
                              resolve, reject) {
                              i.job = savedJob._id;
                              ProcessCtrl.addJobProcess({
                                 body: i
                              }, {}, function(e,
                                 r) {
                                 if (e) {
                                    console.log(
                                       'error creating default job process : ',
                                       e);
                                    return reject(
                                       e);
                                 }
                                 resolve(r);
                              });
                           });
                        })
                        .then(function(res) {
                           next(null, res);
                        })
                        .catch(next);
                  });
            });
         next({
            message: req.body.code + " - job id exists!"
         });
      });
};

module.exports.update = function(req, res, next) {
   Job.findById(req.body._id, function(err, job) {
      if (err) return next(err);
      job.code = req.body.code;
      job.name = req.body.name;
      job.amount = req.body.amount;
      job.comment = req.body.comment;
      job.client = req.body.client;
      job.startDate = req.body.startDate;
      job.totalMaterialCost = req.body.totalMaterialCost;
      job.totalProcessCost = req.body.totalProcessCost;
      job.poAmount = req.body.poAmount;
      job.save(next);
   });
};

module.exports.delete = function(req, res, next) {
   Job
      .remove({
         _id: req.body._id
      }, next);
};

module.exports.activity = function(req, res, next) {
   Job.findById(req.body._id, function(err, job) {
      if (err) return next(err);
      job.activity = 'active';
      job.save(next);
   });
};

module.exports.inActivity = function(req, res, next) {
   Job.findById(req.body._id, function(err, job) {
      if (err) return next(err);
      job.activity = 'inactive';
      job.save(next);
   });
};


module.exports.jobInfo = function(req, res, next) {
   Job
      .findOne({
         _id: req.body._id
      })
      .exec(next);
};

module.exports.searchJob = function(req, res, next) {
   var searchCriteria = {
      $or: [{
         name: {
            '$regex': req.params.name.toString(),
            '$options': 'i'
         }
      }, {
         code: {
            '$regex': req.params.name.toString(),
            '$options': 'i'
         }
      }]
   };
   var empSerch = {
      $and: [searchCriteria, {
         activity: 'active'
      }, {
         startDate: {
            $lte: new Date()
         }
      }]
   };


   if (req.user.role == 'employee') {
      searchCriteria = empSerch;
   }
   Job
      .find(searchCriteria)
      .exec(next);
};


var getJob = function(req, res, next) {
   var job = req.body.job;
   if (!job) {
      return next(null, {});
   }
   Job
      .findOne({
         _id: job._id
      })
      .populate('client', '_id name')
      .exec(next);
};


var getMaterial = function(req, res, next) {
   var job = req.body.job;
   if (!job) {
      job = {};
   } else {
      job = {
         'job': new ObjectId(job._id)
      };
   }
   /*Material
      .find(job)
      .sort({
         materialType: 1
      })
      .populate('materialType')
      .exec(next);*/

   Material
      .aggregate([{
         $match: job
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
            _id: '$materialType._id',
            amount: {
               $sum: "$$CURRENT.amount"
            },
            name: {
               $first: "$materialType.name"
            },
            count: {
               $sum: 1
            },
            details: {
               "$push": "$$CURRENT"
            }
         }
      }], function(err, result) {
         if (err) {
            return next(err, null);
         }
         var tmpr = [];
         var tmp;
         result.map(function(obj) {
            tmp = JSON.parse(JSON.stringify(obj));
            delete tmp.details;
            tmpr.push(tmp);
            for (var i = 0; i < obj.details.length; i++) {
               obj.details[i].nameT = obj.details[i].name.toString();
               obj.details[i].cost = obj.details[i].amount.toFixed(2).toString();
               delete obj.details[i].name;
               delete obj.details[i].amount;
               tmpr.push(obj.details[i]);
            }
         });
         result = tmpr;
         // console.log('######## Result ########');
         // console.log(JSON.stringify(result));
         // console.log((result));
         // console.log('######## ###### ########');
         return next(null, result);
      });


};

var getEffort = function(req, res, next) {
   var job = req.body.job;
   if (!job) {
      job = {};
   } else {
      job = {
         'job': job._id
      };
   }
   var effArr = [];
   Effort
      .find(job)
      .exec(function(e, r) {
         if (e) {
            console.log(e);
            return next(e, null);
         }
         r.map(function(effort) {
            var hours;
            if (effort.stop && effort.start) {
               hours = (effort.stop - effort.start) / 100000;
               hours = parseInt(hours) / 36;
               hours = parseInt(hours * 100) / 100;
            } else {
               hours = 0;
            }
            if (effArr[effort.process]) {
               effArr[effort.process].hours += hours;
            } else {
               effArr[effort.process] = {};
               effArr[effort.process].hours = hours;
               effArr[effort.process].process = effort.process;
            }
         });
         // console.log(effArr);
         var keys = [];
         for (var key in effArr) {
            // console.log('key', key);
            // console.log('effArr[key]', effArr[key]);
            if (effArr.hasOwnProperty(key)) {
               keys.push(effArr[key]);
            }
         }
         Promise.map(keys, function(obj) {
               return new Promise(function(resolve, reject) {
                  Process.findOne(obj.process)
                     // .populate('job')
                     .exec(function(e, process) {
                        if (e) {
                           console.log(e);
                           return reject(e);
                        }
                        obj.cost = obj.hours * process.rate;
                        obj.rate = process.rate.toFixed(2);
                        obj.actualCost = obj.cost.toFixed(2);
                        obj.name = process.name;
                        return resolve(obj);
                     });
               });
            })
            .then(function(process) {
               // console.log(process);
               next(null, process);
            })
            .catch(function(err) {
               next(err, null);
            });
      });
   // Effort
   //    .aggregate([{
   //       "$project": {
   //          start: 1
   //       }
   //    }, {
   //       "$group": {
   //          _id: '$_id'
   //       }
   //    }])
   //    .exec(function(e, r) {
   //       if (e) {
   //          console.log(e);
   //          return next(e, null);
   //       }
   //       console.log(r);
   //       Promise.map(r, function(obj) {
   //             return new Promise(function(resolve, reject) {
   //                Process.findOne(obj._id)
   //                   .populate('job')
   //                   .exec(function(e, process) {
   //                      if (e) return reject(e);
   //                      process.hours = obj.hours;
   //                      process.cost = process.hours * process.rate;
   //                      process.actualCost = obj.total;
   //                      return resolve(process);
   //                   });
   //             });
   //          })
   //          .then(function(process) {
   //             next(null, process);
   //          })
   //          .catch(function(err) {
   //             next(err, null);
   //          });
   //    });
};

var getScrap = function(req, res, next) {
   Scrap
      .find({
         job: req.body.job._id
      })
      .populate('materialType', '_id name')
      .exec(function(e, r) {
         if (e) {
            console.log(e);
            return next(e, null);
         }
         var sum = 0;
         r.map(function(o) {
            sum += o.amount || 0;
         });
         return next(null, sum);
      });
};

var jobReport = function(req, res, next) {
   Promise.map([getMaterial, getEffort, getJob, getScrap], function(fn) {
         return new Promise(function(resolve, reject) {
            fn(req, res, function(e, r) {
               if (e) {
                  console.log(e);
                  return reject(e);
               }
               resolve(r);
            });
         });
      })
      .then(function(compJobInfo) {
         next(null, compJobInfo);
      })
      .catch(function(e) {
         next(e, null);
      });

};


module.exports.excelReport = function(req, res, next) {

   // console.log('generateXls');
   jobReport(req, res, function(err, result) {
      if (err) {
         console.log('Error : generateExcel : jobReport()', err);
         return next(err);
      }
      // console.log('\nGot jobReport()\n :', result);
      var material = result[0];
      var process = result[1];
      var job = result[2];
      var scrap = result[3];
      var mRows = material.length;
      var pRows = process.length;
      //Header of Excel
      var header = [];
      var subTotalA = 0;
      var subTotalB = 0;
      var subTotalC = 0;
      var totalToolingCost = 0;
      header.push('TOOLING COST BREAKDOWN');

      //Body of Excel
      var body = [];
      //Add header in body
      body.push(header);

      tbody = [];
      tbody.push('JOB NO :');
      tbody.push(job.code);
      tbody.push('');
      tbody.push('CUSTOMER :');
      tbody.push(job.client.name);
      body.push(tbody);


      tbody = [];
      tbody.push('Quote Price :');
      tbody.push(job.amount);
      tbody.push('');
      tbody.push('PROFIT AMT :');
      tbody.push('');
      body.push(tbody);


      tbody = [];
      tbody.push('TOTAL AMOUNT :');
      tbody.push('');
      tbody.push('');
      tbody.push('DATE :');
      tbody.push(job.createdAt ? moment(job.createdAt).utcOffset(330).format(
         'DD/MM/YYYY') : '');
      body.push(tbody);
      body.push([]);

      tbody = [];
      tbody.push('');
      tbody.push('MATERIAL NAME');
      tbody.push('');
      tbody.push('COST');
      body.push(tbody);

      tbody = [];
      for (i = 0; i < mRows; i++) {
         tbody.push('');
         tbody.push(material[i].name ? material[i].name : '  ( ' +
            material[i].nameT + ')');
         tbody.push(material[i].nameT ? material[i].cost : '');
         tbody.push(material[i].amount ? parseFloat(material[i].amount).toFixed(2).toString() :
            '');
         subTotalA += material[i].amount ? material[i].amount : 0;
         body.push(tbody);
         tbody = [];
      }


      tbody.push('');
      tbody.push('');
      tbody.push('SUB TOTAL-A');
      tbody.push(subTotalA.toFixed(2).toString());
      body.push(tbody);


      tbody = [];
      tbody.push('');
      tbody.push('PROCESS COST');
      tbody.push('HOURS X RATE');
      tbody.push('');
      body.push(tbody);


      tbody = [];
      for (i = 0; i < pRows; i++) {
         tbody.push('');
         tbody.push(process[i].name);
         tbody.push(process[i].hours.toString() + ' X ' + process[i].rate
            .toString());
         tbody.push('');
         body.push(tbody);
         tbody = [];
      }


      tbody.push('');
      tbody.push('');
      tbody.push('SUB TOTAL-B');
      subTotalB = process[0] ? process[0].actualCost : 0;
      tbody.push(parseFloat(subTotalB).toFixed(2).toString());
      body.push(tbody);

      tbody = [];
      tbody.push('');
      tbody.push('SCRAP COST');
      tbody.push('SUB TOTAL-C');
      subTotalC = scrap;
      tbody.push(subTotalC.toFixed(2).toString());
      body.push(tbody);

      tbody = [];
      tbody.push('TOTAL TOOLING COST');
      tbody.push('');
      tbody.push('A+B+C');
      totalToolingCost = subTotalA + parseFloat(subTotalB) + parseFloat(subTotalC);
      tbody.push(parseFloat(totalToolingCost).toFixed(2).toString());
      body.push(tbody);

      body[2][4] = (job.amount - totalToolingCost).toString();
      body[3][1] = (Math.round(totalToolingCost * 100) / 100).toString();

      var filename = Date.now() + '.xlsx';
      var filepath = path.join(__dirname, '../uploads/xls/' + filename);
      // console.log('filename', filename);

      var ws_name = "Sheet1";

      var wb = new Workbook(),
         ws = sheet_from_array_of_arrays(body);

      /* add worksheet to workbook */
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;

      /* write file */
      XLSX.writeFile(wb, filepath);
      next(null, {
         filename: filename,
         path: filepath
      });
   });

};

module.exports.jobReport = jobReport;


function datenum(v, date1904) {
   if (date1904) v += 1462;
   var epoch = Date.parse(v);
   return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
   var ws = {};
   var range = {
      s: {
         c: 10000000,
         r: 10000000
      },
      e: {
         c: 0,
         r: 0
      }
   };
   for (var R = 0; R != data.length; ++R) {
      for (var C = 0; C != data[R].length; ++C) {
         if (range.s.r > R) range.s.r = R;
         if (range.s.c > C) range.s.c = C;
         if (range.e.r < R) range.e.r = R;
         if (range.e.c < C) range.e.c = C;
         var cell = {
            v: data[R][C]
         };
         if (cell.v == null) continue;
         var cell_ref = XLSX.utils.encode_cell({
            c: C,
            r: R
         });

         if (typeof cell.v === 'number') cell.t = 'n';
         else if (typeof cell.v === 'boolean') cell.t = 'b';
         else if (cell.v instanceof Date) {
            cell.t = 'n';
            cell.z = XLSX.SSF._table[14];
            cell.v = datenum(cell.v);
         } else cell.t = 's';

         ws[cell_ref] = cell;
      }
   }
   if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
   return ws;
}

function Workbook() {
   if (!(this instanceof Workbook)) return new Workbook();
   this.SheetNames = [];
   this.Sheets = {};
}