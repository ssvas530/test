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
var Batch = require('../models').Batch;
var path = require('path');
global.appRoot = path.resolve(__dirname + '/../');



var getJobDteRange = function(qdata, next) {
   var req = qdata.req;
   var res = qdata.res;
   var query = {};
   if (qdata.lte && qdata.gte) {
      query.start = {
         $gte: new Date(qdata.gte),
         $lte: new Date(qdata.lte)
      };
   }
   if (qdata.job) {
      query.job = ObjectId(qdata.job._id);
   }
   // console.log('query', query);
   Effort.aggregate({
      $match: query
   }, {
      $lookup: {
         "from": "jobs",
         "localField": "job",
         "foreignField": "_id",
         "as": "job"
      }
   }, {
      $unwind: {
         "path": "$job"
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
      $lookup: {
         "from": "users",
         "localField": "user",
         "foreignField": "_id",
         "as": "user"
      }
   }, {
      $unwind: {
         "path": "$user"
      }
   }, {
      $group: {
         _id: {
            job: {
               _id: "$job._id",
               name: "$job.name",
               code: "$job.code"
            },
            year: {
               $year: "$createdAt"
            },
            month: {
               $month: "$createdAt"
            },
            process: {
               _id: "$process.name1",
               name: "$process.name"
            },
            user: {
               _id: "$user._id",
               name: "$user.name"
            }
         },
         effort: {
            $sum: {
               "$divide": [{
                  "$subtract": ["$stop", "$start"]
               }, 1000 * 60 * 60]
            }
         }
      }
   }, {
      $group: {
         _id: {
            job: "$_id.job",
            year: "$_id.year",
            month: "$_id.month",
            process: "$_id.process"
         },
         userEffort: {
            $addToSet: {
               user: "$_id.user._id",
               data: "$_id.user",
               effort: {
                  $sum: "$effort"
               }
            }
         }
      }
   }, {
      $group: {
         _id: {
            job: "$_id.job",
            year: "$_id.year",
            month: "$_id.month"
         },
         processEffort: {
            $addToSet: {
               process: "$_id.process._id",
               data: "$_id.process",
               userEffort: "$userEffort"
            }
         }
      }
   }, {
      $group: {
         _id: {
            job: "$_id.job",
            year: "$_id.year"
         },
         monthlyEffort: {
            $push: {
               month: "$_id.month",
               processEffort: "$processEffort"
            }
         }
      }
   }, {
      $group: {
         _id: {
            job: "$_id.job._id",
            data: "$_id.job"
         },
         yearlyEffort: {
            $push: {
               year: "$_id.year",
               monthlyEffort: "$monthlyEffort"
            }
         }
      }
   }, function(e, r) {
      if (e) {
         console.log(e);
         return next(e, null);
      }
      // return next(null, r);
      // console.log('r.length', r.length);
      var process = {};
      var years = [];
      var job = {};
      var row = [];
      var validId = {};
      for (var jj in r) {
         j = r[jj];
         // console.log('j', j);
         job[j._id.job] = j._id.data;
         job[j._id.job].year = {};
         for (var yy in j.yearlyEffort) {
            y = j.yearlyEffort[yy];
            createMonths(j._id.data, y.year, row);
            job[j._id.job].year[y.year] = {};
            job[j._id.job].year[y.year].month = {};
            if (!years.hasOwnProperty(y.year)) {
               years[y.year] = y.year;
            }
            for (var mm in y.monthlyEffort) {
               var m = y.monthlyEffort[mm];
               job[j._id.job].year[y.year].month[m.month] = {};
               job[j._id.job].year[y.year].month[m.month].process = {};
               for (var pp in m.processEffort) {
                  var p = m.processEffort[pp];
                  job[j._id.job].year[y.year].month[m.month].process[p.process] = {};
                  // job[j._id.job].year[y.year].month[m.month].process[p.process].user = {};
                  // if (!process.hasOwnProperty(p.process)) {
                  //    process[p.process] = p.data;
                  // }
                  for (var uu in p.userEffort) {
                     var u = p.userEffort[uu];
                     if (!u.effort) {
                        // console.log('u.effort', u.effort);
                        continue;
                     }
                     if (!process.hasOwnProperty(p.process)) {
                        process[p.process] = p.data;
                     }
                     if (!job[j._id.job].year[y.year].month[m.month].process[p.process].hasOwnProperty('user')) {
                        job[j._id.job].year[y.year].month[m.month].process[p.process].user = {};
                     }
                     job[j._id.job].year[y.year].month[m.month].process[p.process].user[u.user] = {};
                     job[j._id.job].year[y.year].month[m.month].process[p.process].user[u.user].effort = u.effort;
                     validId[j._id.job + '.year.' + y.year + '.month.' + m.month + '.process.' + p.process +
                        '.user.' + u.user + '.effort'] = true;
                     if (process[p.process].hasOwnProperty('user')) {
                        process[p.process].user[u.user] = u.data;
                     } else {
                        process[p.process].user = {};
                        process[p.process].user[u.user] = u.data;
                     }
                  }
               }
            }
         }
      }
      var columnProcess = [];
      var columnEmp = [];
      for (var tp in process) {
         pr = process[tp];
         var count = 0;
         for (var tu in pr.user) {
            count++;
            // excelColumn++;
            columnEmp.push({
               _id: pr.user[tu]._id,
               name: pr.user[tu].name,
               process: {
                  _id: pr._id,
                  name: pr.name
               }
            });
            // ws.cell(2, excelColumn).string(pr.user[tu].name).style(style);
         }
         // console.log('pr', pr);
         // ws.cell(1, excelColumn - count + 1, 1, excelColumn, true).string(pr.name).style(style);
         columnProcess.push({
            _id: pr._id,
            name: pr.name,
            count: count
         });
      }
      // var start = new Date();
      var tarray = [];
      // var pushColumn = new Array(columnEmp.length);
      // for (var tr in row) {
      //    // console.log('row[tr]', row[tr]);
      //    tarray.push([]);
      //    // Adds cols to the empty line:
      //    tarray[tr].push(pushColumn);
      //    for (var tc in columnEmp) {
      //       var str = row[tr].job._id + '.year.' + row[tr].year + '.month.' +
      //          row[tr].month + '.process.' + columnEmp[tc].process._id + '.user.' + columnEmp[tc]._id +
      //          '.effort';
      //       // tarray[tr][tc] = get(job, str);
      //       tarray[tr][tc] = validId[str] ? job[row[tr].job._id].year[row[tr].year].month[row[tr].month].process[columnEmp[tc].process._id].user[
      //          columnEmp[tc]._id].effort : 0;
      //       if (validId[str]) {
      //          ws.cell(3 + tr, 1 + tc).number(tarray[tr][tc]).style(style);
      //       }
      //    }
      // }
      // var end = new Date() - start;
      // console.info("Execution time: %dms", end);
      // console.log('row.length', row.length);
      // console.log('columnProcess.length', columnProcess.length);
      // return next(null, {
      //    message: 'Data',
      //    // data: [],
      //    // tarray: [],
      //    validId: validId,
      //    years: years,
      //    job: job,
      //    columnProcess: columnProcess,
      //    columnEmp: columnEmp
      // });
      var xl = require('excel4node');
      var wb = new xl.Workbook();
      var ws = wb.addWorksheet('Sheet 1');
      var style = wb.createStyle({
         font: {
            color: '#000000',
            name: 'Verdana',
            size: 10
         },
         alignment: {
            wrapText: true,
            horizontal: 'center'
         },
         border: {
            left: {
               style: 'thin',
               color: '#000000'
            },
            right: {
               style: 'thin',
               color: '#000000'
            },
            top: {
               style: 'thin',
               color: '#000000'
            },
            bottom: {
               style: 'thin',
               color: '#000000'
            },
            outline: true
         }
      });
      var styleHeader = wb.createStyle({
         font: {
            bold: true
         },
         alignment: {
            vertical: 'center'
         },
         border: {
            left: {
               style: 'medium',
               color: '#000000'
            },
            right: {
               style: 'medium',
               color: '#000000'
            },
            top: {
               style: 'medium',
               color: '#000000'
            },
            bottom: {
               style: 'medium',
               color: '#000000'
            },
            outline: true
         }
      });
      var styleFiller = wb.createStyle({
         font: {
            bold: true
         },
         alignment: {
            vertical: 'center'
         },
         border: {
            top: {
               style: 'medium',
               color: '#000000'
            },
            outline: true
         }
      });
      ws.cell(1, 1, 2, 1, true).string('Job').style(style).style(styleHeader);
      ws.cell(1, 2, 2, 2, true).string('Year').style(style).style(styleHeader);
      ws.cell(1, 3, 2, 3, true).string('Month').style(style).style(styleHeader);
      // wb.write('Excel.xlsx');
      var excelRow = 2;
      var excelColumn = 3;
      var jobStart, yearStart;
      var tmp, x, c, yc = 0,
         cc = 0;
      var processTotal = {};
      for (tmp in columnProcess) {
         excelColumn++;
         x = columnProcess[tmp];
         ws.cell(1, excelColumn, 1, excelColumn + x.count - 1, true).string(x.name).style(style).style(styleHeader);
         excelColumn = excelColumn + x.count - 1;
      }
      excelColumn = 3;
      yearlyColumn = [];
      for (tmp in columnEmp) {
         excelColumn++;
         x = columnEmp[tmp];
         ws.cell(2, excelColumn).string(x.name).style(style).style(styleHeader);
      }
      excelColumn = 3;
      jobStart = excelRow + 1;
      yearStart = excelRow + 1;
      for (tmp in row) {
         excelColumn = 3;
         excelRow++;
         yc++;
         cc++;
         r = row[tmp];
         // // Job changed
         // if ((tmp > 0 && row[tmp - 1].job.code != row[tmp].job.code)) {
         //    // console.log('EOJOB---------cc, yc, excelRow', cc, ',', yc, ',', excelRow);
         //    // ws.cell(excelRow - cc, 1, excelRow, 1, true).string(row[tmp - 1].job.code).style(style).style(styleHeader);
         //    // cc = 0;
         //    ws.cell(jobStart, 1, excelRow - 1, 1, true).string(row[tmp - 1].job.code).style(style).style(styleHeader);
         //    jobStart = excelRow;
         // }
         // Year changed
         if ((tmp > 0 && row[tmp - 1].year != row[tmp].year) || (tmp > 0 && row[tmp - 1].job.code != row[tmp].job.code)) {
            // console.log('EOYEAR---------cc, yc, excelRow', cc, ',', yc, ',', excelRow);
            ws.cell(yearStart, 2, excelRow + 1, 2, true).number(row[tmp - 1].year).style(style).style(styleHeader);
            ws.cell(excelRow, 3)
               .string("Total").style(
                  style).style(styleHeader);
            for (var tot = 0; tot < columnEmp.length; tot++) {
               if (yearlyColumn[4 + tot]) {
                  ws.cell(excelRow, 4 + tot)
                     .string(yearlyColumn[4 + tot]).style(
                        style);
               } else {
                  ws.cell(excelRow, 4 + tot)
                     .string("0.00").style(
                        style);
               }
            }
            excelRow++;
            var start = 4;
            for (var cp1 in columnProcess) {
               var value = parseFloat(0);
               x = columnProcess[cp1];
               if (processTotal[x._id])
                  value = parseFloat(processTotal[x._id]);
               // console.log('start ', start, '  end ', start + x.count);
               ws.cell(excelRow, start, excelRow, start + x.count - 1, true).number(value).style(style).style(styleHeader);
               start = start + x.count;
            }
            processTotal = {};
            excelRow++;
            yearStart = excelRow;
            if ((tmp > 0 && row[tmp - 1].job.code != row[tmp].job.code)) {
               ws.cell(jobStart, 1, excelRow - 1, 1, true).string(row[tmp - 1].job.code).style(style).style(styleHeader);
               jobStart = excelRow;
            }
            // ws.cell(excelRow - yc, 2, excelRow, 2, true).number(row[tmp - 1].year).style(style).style(styleHeader);

            yearlyColumn = [];
            yc = 0;
            cc++;
         }
         ws.cell(excelRow, 3).string(r.monthName).style(style).style(styleHeader);
         for (var i = 0; i < columnEmp.length; i++) {
            excelColumn++;
            c = columnEmp[i];
            if (validId[r.job._id + '.year.' + r.year + '.month.' + r.month +
                  '.process.' + c.process._id +
                  '.user.' + c._id + '.effort']) {
               var colValue = parseFloat(Math
                     .round((job[r.job._id].year[r.year].month[r.month].process[c.process._id].user[c._id].effort) * 100) / 100)
                  .toFixed(2);
               yearlyColumn[excelColumn] = yearlyColumn[excelColumn] ? (parseFloat(colValue) + parseFloat(yearlyColumn[excelColumn]))
                  .toFixed(2) : colValue;
               processTotal[c.process._id] = processTotal[c.process._id] ? (parseFloat(colValue) +
                  parseFloat(processTotal[c.process._id])) : parseFloat(colValue);
               // console.log('yearlyColumn[excelColumn] ,colValue', yearlyColumn[excelColumn], colValue);
               ws.cell(excelRow, excelColumn)
                  .string(colValue).style(
                     style);
            } else {
               ws.cell(excelRow, excelColumn)
                  .string("0").style(
                     style);
            }
         }
         if (tmp == row.length - 1) {
            excelRow++;
            ws.cell(excelRow, 3)
               .string("Total").style(
                  style).style(styleHeader);
            for (var j = 0; j < columnEmp.length; j++) {
               if (yearlyColumn[4 + j]) {
                  ws.cell(excelRow, 4 + j)
                     .string(yearlyColumn[4 + j]).style(
                        style);
               } else {
                  ws.cell(excelRow, 4 + j)
                     .string("0.00").style(
                        style);
               }
            }
            yearlyColumn = [];
            excelRow++;
            var start2 = 4;
            for (var cp2 in columnProcess) {
               var value2 = parseFloat(0);
               x = columnProcess[cp2];
               if (processTotal[x._id])
                  value2 = parseFloat(processTotal[x._id]);
               ws.cell(excelRow, start2, excelRow, start2 + x.count - 1, true).number(value2).style(style).style(styleHeader);
               start2 = start2 + x.count;
            }
            processTotal = {};
            // console.log('EOR---------cc, yc, excelRow', cc, ',', yc, ',', excelRow);
            // ws.cell(excelRow - yc, 2, excelRow, 2, true).number(row[tmp - 1].year).style(style).style(styleHeader);
            // ws.cell(excelRow - cc, 1, excelRow, 1, true).string(row[tmp - 1].job.code).style(style).style(styleHeader);
            ws.cell(yearStart, 2, excelRow, 2, true).number(row[tmp - 1].year).style(style).style(styleHeader);
            ws.cell(jobStart, 1, excelRow, 1, true).string(row[tmp - 1].job.code).style(style).style(styleHeader);

            ws.cell(excelRow + 1, 1, excelRow + 1, 3).string("").style(styleFiller);
         }
      }

      var batch = new Batch();
      batch.name = new Date().getTime() + '.xlsx';
      batch.sDate = req.body.gte;
      batch.eDate = req.body.lte;
      batch.job = req.body.job;
      batch.startTime = new Date();
      batch.status = 'running';
      batch.path = __dirname + '/../downloads/' + batch.name;
      batch.path = global.appRoot + '/downloads/' + batch.name;
      // var end = new Date() - start;
      // console.info("Execution time: %dms", end);
      console.log('path', batch.path);
      // var result = {
      //    data: job, //r
      //    validId: validId,
      //    tarray: tarray,
      //    years: years,
      //    row: row,
      //    columnProcess: columnProcess,
      //    columnEmp: columnEmp
      // };
      // next(null, result);
      Batch
         .findOne({
            status: 'running'
         })
         .exec(function(err, result) {
            if (err) {
               console.log('error:', err);
               return next(err);
            }
            if (!result) return batch.save(function(e, r) {
               if (e) {
                  console.log(e);
                  return next(e);
               }
               next(null, {
                  message: 'Queued for batch processing',
                  data: [],
                  validId: [],
                  tarray: [],
                  years: [],
                  row: [],
                  columnProcess: [],
                  columnEmp: []
               });
               wb.write(batch.path, function(err, stats) {
                  if (err) {
                     console.error('err', err);
                     r.status = 'failed';
                     r.endTime = new Date();
                     r.message = err.message;
                     r.save();
                  } else {
                     r.status = 'completed';
                     r.endTime = new Date();
                     r.save();
                     // console.log('stats', stats); // Prints out an instance of a node.js fs.Stats object
                  }
               });

            });
            next({
               message: 'A batch is in progress. Please wait for its completion'
            });
         });
   });
};

var has = function(obj, key) {
   return key.split(".").every(function(x) {
      if (typeof obj != "object" || obj === null || !(x in obj))
         return false;
      obj = obj[x];
      return true;
   });
};
var get = function(obj, key) {
   return key.split(".").reduce(function(o, x) {
      return (typeof o == "undefined" || o === null) ? 0 : o[x];
   }, obj);
};

function createMonths(job, year, row) {
   for (var i = 0; i < 12; i++) {
      row.push({
         job: {
            _id: job._id,
            name: job.name,
            code: job.code
         },
         year: year,
         month: i + 1,
         monthName: months[i]
      });
   }
}
var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
module.exports.printMe = function(req, res, next) {
   // var lte = new Date();
   // var gte = new Date(2017, 9, 9); //3 3
   var lte = new Date(2017, 1, 12);
   var gte = new Date(2017, 1, 1); //3 3
   // console.log('\nlte ', lte, '\ngte: ', gte);
   getJobDteRange({
      req: req,
      res: res,
      gte: gte,
      lte: lte,
      job: req.body.job
   }, function(e, r) {
      if (e) {
         console.log(e);
         return next(e, r);
      }
      // var formated = [];
      // rows=[];
      // for (var job in r[0]) {
      //    for (var year in job.yearlyEffort) {
      //       for (var month in year.monthlyEffort) {
      //          var month1 = [];
      //          var month1 = {};
      //          month1[]
      //          formated.push({
      //             job: job._id,
      //             year: year.year
      //          });
      //       }
      //    }
      // }
      next(null, r);
   });
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


module.exports.getBatchInfo = function(req, res, next) {
   Batch
      .find({})
      .populate('job')
      .sort('-createdAt')
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         if (!result)
            return next(null, {
               data: [],
               count: 0
            });
         next(null, {
            data: result,
            count: result.length
         });
      });
};

module.exports.downloadFile = function(req, res, next) {
   Batch
      .findOne({
         _id: req.body._id
      })
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         next(null, {
            path: result.path
         });
      });
};