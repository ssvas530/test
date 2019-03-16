var Effort = require('../models').Effort;
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');
var XLSX = require('xlsx');
var moment = require('moment');

module.exports.findAll = function(req, res, next) {
   var obj = {};
   if (req.user.role == 'employee') {
      obj.user = req.user._id;
   }
   Effort
      .find(obj)
      .populate('user', '_id name')
      .populate('job', '_id name title')
      .populate('process', '_id name')
      .exec(next);
};


module.exports.jobEffort = function(req, res, next) {
   var obj = {};
   if (req.user.role == 'employee') {
      obj.user = req.user._id;
   }
   if (req.body._id) {
      obj.job = req.body._id;
   }
   obj.stop = null;
   Effort
      .find(obj)
      .populate('user', '_id name')
      .populate('job', '_id name title')
      .populate('process', '_id name')
      .exec(next);
};

module.exports.jobEffortFindOne = function(req, res, next) {
   var obj = {};
   obj._id = req.body.effort;
   Effort
      .find(obj)
      .populate('user', '_id name')
      .populate('job', '_id name title')
      .populate('process', '_id name')
      .exec(next);
};

module.exports.create = function(req, res, next) {
   var effort = new Effort();
   effort.user = req.user._id;
   if (req.user.role == 'admin' || req.user.role == 'super') {
      effort.user = req.body.user;
   }
   effort.job = req.body.job;
   effort.process = req.body.process;
   effort.partNo = req.body.partNo ? req.body.partNo.toUpperCase().replace(/ /g, '') : null;
   effort.start = req.body.start;
   effort.stop = req.body.stop;
   effort.stop = req.body.stop;
   effort.total = req.body.total;
   effort.overtime = req.body.overtime;
   effort.save(next);
};

module.exports.update = function(req, res, next) {
   Effort.findById(req.body._id, function(err, effort) {
      if (err) {
         console.log('error:', err);
         return next(err);
      }
      if (req.user.role == 'admin' || req.user.role == 'super') {
         effort.user = req.body.user;
         effort.process = req.body.process;
      }
      effort.partNo = req.body.partNo ? req.body.partNo.toUpperCase().replace(/ /g, '') : null;
      effort.start = req.body.start;
      effort.stop = req.body.stop;
      effort.total = req.body.total;
      effort.overtime = req.body.overtime;
      effort.save(next);
   });
};

module.exports.delete = function(req, res, next) {
   Effort.remove({
      _id: req.body._id
   }, next);
};

module.exports.partNo = function(req, res, next) {
   Effort
      .find({
         job: req.body.job
      })
      .distinct('partNo', next);
};


module.exports.totalEffortCost = function(req, res, next) {
   Effort
      .find({
         job: req.body.job,
         partNo: req.body.partNo
      })
      .populate('process', '_id name rate')
      .exec(function(e, r) {
         if (e) {
            return next(e, null);
         }
         console.log('r:', r);
         var sum = 0;
         Promise
            .map(r, function(effort) {
               return new Promise(function(resp, rej) {
                  var hours = (Math.round((effort.stop - effort.start) / (36000))) / 100;
                  var cost = effort.process.rate * hours;
                  sum += cost;
                  console.log('sum : ', sum);
                  return resp(sum);
               });

            })
            .then(function(sumArray) {
               // console.log(sum);
               next(null, Math.round(sum * 100) / 100);
            });

      });
   /*
      Effort
         .aggregate([

            {
               $match: {
                  'job': req.body._id,
                  'partNo': req.body.partNo.toUpperCase().replace(/ /g, '')
               }
            }, {
               "$lookup": {
                  "from": "process",
                  "localField": "process",
                  "foreignField": "_id",
                  "as": "process"
               }
            }, {
               "$unwind": "$process"
            }, {
               "$project": {
                  cost: {
                     $multiply: [{
                        $divide: [{
                           $subtract: ["$start", "$stop"]
                        }, 1000 * 60 * 60]
                     }, '$process.rate']
                  }
               }
            }, {
               "$group": {
                  total: {
                     $sum: "$cost"
                  }
               }
            }

         ])
         .exec(next);
   */
};

var effortReport = function(req, res, next) {
   var empOpt = req.body.emp;
   if (req.user.role == 'employee') {
      empOpt = req.user._id;
   }
   var jobOpt = req.body.job;
   var sDate = req.body.sDate;
   var eDate = req.body.eDate;
   var opts = [];
   if (jobOpt) {
      opts.push({
         'job': jobOpt
      });
   }
   if (empOpt) {
      opts.push({
         'user': empOpt
      });
   }
   if (sDate && eDate) {
      opts.push({
         'start': { //createdAt
            "$gte": sDate,
            "$lte": eDate
         }
      });
   }
   var filterOpts;
   if (opts.length === 1) {
      filterOpts = opts[0];
   } else if (opts.length > 1) {
      filterOpts = {
         $and: opts
      };
   } else {
      filterOpts = {};
   }
   Effort
      .find(filterOpts)
      .populate('user', '_id name')
      .populate('job', '_id name code')
      .populate('process', '_id name')
      .exec(next);
};

var hourMinute = function(time) {
   if (!time) return '0';
   var h = parseInt(time / 3600000);
   var m = parseInt((time % 3600000) / 60000);
   return h + ' h ' + m + ' m';
};



module.exports.excelReport = function(req, res, next) {

   // console.log('generateXls');
   effortReport(req, res, function(err, result) {
      if (err) {
         console.log('Error : generateExcel : effortReport()');
         return next(err);
      }
      console.log('\nGot summary\n');
      var rows = result.length;
      //Header of Excel
      var header = [];
      header.push('Sl No.');
      header.push('Job');
      header.push('Employee');
      header.push('Process');
      header.push('Part No');
      header.push('Started Time');
      header.push('End Time');
      header.push('Regular');
      header.push('Overtime');

      //Body of Excel
      var body = [];
      //Add header in body
      body.push(header);

      tbody = [];
      for (i = 0; i < rows; i++) {
         tbody.push((i + 1).toString());
         tbody.push(result[i].job ? result[i].job.name : '');
         tbody.push(result[i].user.name);
         tbody.push(result[i].process.name);
         tbody.push(result[i].partNo ? result[i].partNo : '');
         tbody.push(result[i].start ? moment(result[i].start).utcOffset(330).format('DD/MM/YYYY') : '');
         tbody.push(result[i].stop ? moment(result[i].stop).utcOffset(330).format('DD/MM/YYYY') : '');
         tbody.push(hourMinute(result[i].total - result[i].overtime));
         tbody.push(hourMinute(result[i].overtime));
         body.push(tbody);
         tbody = [];
      }
      console.log('Excel data');

      var filename = Date.now() + '.xlsx';
      var filepath = path.join(__dirname, '../uploads/xls/' + filename);
      console.log('filename', filename);

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

module.exports.effortReport = effortReport;

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