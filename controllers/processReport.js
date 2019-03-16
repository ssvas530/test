var Job = require('../models').Job;
var Process = require('../models').Process;
var Promise = require('bluebird');
var Effort = require('../models').Effort;
var Material = require('../models').Material;
var Scrap = require('../models').Scrap;
var path = require('path');
var XLSX = require('xlsx');
var moment = require('moment');
var mongoose = require('mongoose');

var ObjectID = require('mongodb').ObjectID;

var mongojs = require('mongojs')
var db = mongojs('prox')

/* get expense report*/

module.exports.processReport = function(req, res, next) {

   try {
      var job = req.body.job;
      var job5 = req.body.job;
      var ssDate = req.body.sDate;
      var eeDate = req.body.eDate
      if (ssDate && eeDate) {
         var sDate = new Date(ssDate);
         var eDate = new Date(eeDate);
      }

      var job2 = req.body.job;
      var job3 = req.body.job;

      if (!job) {
         job = {};
         job2 = {};
         job3 = {};

      } else {
         var jobs = (job._id).toString();
         job = {
            'job': ObjectID(jobs)
         };

         job3 = {
            '_id': ObjectID(jobs)
         };

         job2 = {
            'job': ObjectID(jobs)
         };
      }

      var finalJson = Array();

      if (ssDate && eeDate && job3) {
         job2 = {
            $and: [job3, {
               'start': {
                  '$gte': sDate
               }
            }, {
               'end': {
                  '$lte': eDate
               }
            }]
         };
         job = {
            $and: [job3, {
               'date': {
                  '$gte': sDate,
                  '$lte': eDate
               }
            }]
         };
      } else if (ssDate && eeDate) {
         job = {
            'date': {
               '$gte': sDate,
               '$lte': eDate
            }
         };
         job2 = {
            $and: [{
               'start': {
                  '$gte': sDate
               }
            }, {
               'end': {
                  '$lte': eDate
               }
            }]
         };
      }


      var hours;
      var cost;
      var estCost;
      var processName;
      var processArray = Array()
      var materialPreArray = Array()
      var scrapPreArray = Array()


      var processNames = Array();
      var processQuoAct = Array();
      var scrapCost;
      var materialCost;
      var materialEst;
      var material;
      var processedArray;
      var processedEstArray;
      var totalEst;
      var totalCost;
      var profitOrLoss;
      var finalJson = Array();


      return new Promise(function(resolve, reject) {
         Effort.aggregate([{
            '$match': job2
         }, {
            '$lookup': {
               "from": "processes",
               "localField": "process",
               "foreignField": "_id",
               "as": "processResult"
            }
         }]).exec(function(error, results) {
            if (error) {
               reject({
                  error: error
               });
            } else {
               resolve(results);
            }
         });

      }).then(function(result) {
         return new Promise(function(resolve, reject) {
            result.forEach(function(effortResult) {
               if (effortResult) {
                  // console.log(effortResult);
                  hours = 0;
                  cost = 0;
                  estCost = 0;
                  processName = null;
                  if (effortResult.stop && effortResult.start) {
                     hours = (effortResult.stop - effortResult.start) / 100000;
                     hours = parseFloat(hours) / 36;
                     hours = parseFloat(hours * 100) / 100;
                  } else {
                     hours = 0;
                  }

                  (effortResult.processResult).forEach(function(processedResult) {


                     if (processedResult) {
                        // console.log(processedResult);
                        cost = ((parseFloat(processedResult.rate)) * (parseFloat(hours)));
                        estCost = (parseFloat(processedResult.estamount));
                        processName = (processedResult.name);
                        processArray.push({
                           process: processName,
                           est: parseFloat(estCost).toFixed(2),
                           act: parseFloat(cost).toFixed(2),
                           job: String(processedResult.job)
                        })
                     }
                  })

               }


            })
            resolve(true);
         });
      }).then(function(materials) {
         return new Promise(function(resolve, reject) {
            Material.find(job).exec(function(error, results) {
               if (error) {
                  reject({
                     error: error
                  });
               } else {
                  resolve(results);
               }
            });
         })
      }).then(function(cursor) {
         return new Promise(function(resolve, reject) {
            cursor.forEach(function(materialResult) {
               if (materialResult) {
                  // console.log(materialResult);
                  materialPreArray.push(materialResult)

               }


            })
            resolve(true)
         })
      }).then(function(scraps) {
         return new Promise(function(resolve, reject) {
            Scrap.find(job).exec(function(error, results) {
               if (error) {
                  reject({
                     error: error
                  });
               } else {
                  resolve(results);
               }
            });
         })
      }).then(function(cursor) {
         return new Promise(function(resolve, reject) {
            cursor.forEach(function(scrapResult) {
               if (scrapResult) {
                  // console.log(scrapResult);
                  scrapPreArray.push(scrapResult)

               }


            })
            resolve(true)
         })
      }).then(function(process) {
         return new Promise(function(resolve, reject) {
            Process.find({
               "master": true
            }).exec(function(error, results) {
               if (error) {
                  reject({
                     error: error
                  });
               } else {
                  resolve(results);
               }
            });
         })
      }).then(function(cursor) {
         return new Promise(function(resolve, reject) {
            cursor.forEach(function(processResult) {
               if (processResult) {
                  // console.log(processResult);
                  processNames.push({
                     name: processResult.name
                  })
                  processQuoAct.push({
                     est: "Quo"
                  })
                  processQuoAct.push({
                     est: "Act"
                  })
               }


            })
            resolve(true)
         })
      }).then(function(jobs) {
         return new Promise(function(resolve, reject) {
            Job.find().exec(function(error, results) {
               if (error) {
                  reject({
                     error: error
                  });
               } else {
                  resolve(results);
               }
            });
         })
      }).then(function(cursor) {
         return new Promise(function(resolve, reject) {
            cursor.forEach(function(jobResult, jobIndex) {
               if (jobResult) {
                  // console.log(jobResult);
                  totalCost = 0;
                  scrapCost = 0;
                  for (var i = 0; i < scrapPreArray.length; i++) {
                     if (String(jobResult._id) === String(scrapPreArray[i].job))
                        scrapCost += parseFloat(scrapPreArray[i].amount)
                  }


                  materialCost = 0;
                  for (var i = 0; i < materialPreArray.length; i++) {
                     if (String(jobResult._id) === String(materialPreArray[i].job))
                        materialCost += parseFloat(materialPreArray[i].amount)
                  }


                  totalCost += scrapCost + materialCost

                  totalEst = 0;
                  materialEst = jobResult.amount;
                  totalEst += materialEst


                  material = {
                     est: materialEst,
                     act: materialCost
                  }

                  processedArray = Array()
                  processedEstArray = Array()
                  var est = Array();
                  var act = Array();
                  for (var k = 0; k < processNames.length; k++) {
                     est[k] = 0;
                     act[k] = 0;
                     for (var i = 0; i < processArray.length; i++) {
                        if ((processArray[i].process) === (processNames[k].name)) {
                           if (String(jobResult._id) === (processArray[i].job)) {


                              est[k] += processArray[i].est;
                              act[k] += processArray[i].act;
                           }

                        }


                     }
                  }

                  processNames.forEach(function(result, index) {
                     totalEst += parseFloat(est[index]);
                     totalCost += parseFloat(act[index]);
                     processedEstArray.push({
                        est: parseFloat(est[index]).toFixed(2)
                     });
                     processedEstArray.push({
                        est: parseFloat(act[index]).toFixed(2)
                     });
                  })


                  profitOrLoss = 0;
                  profitOrLoss = (parseFloat(totalEst) - parseFloat(totalCost)).toFixed(2)

                  if (totalCost > 0) {
                     /* create res final json object */
                     var jsonObj = {
                        'date': 'tempdate',
                        'job': jobResult.title.split('-')[0],
                        'material': material,
                        'process': processedArray,
                        'processcost': processedEstArray,
                        'scrap': parseFloat(scrapCost).toFixed(2),
                        'totalEstCost': parseFloat(totalEst).toFixed(2),
                        'totalActCost': parseFloat(totalCost).toFixed(2),
                        'status': profitOrLoss

                     }
                  }

                  finalJson.push(jsonObj)
                  if (jobIndex === (cursor.length - 1)) {
                     finalJson.push({
                        processsize: processNames.length * 2,
                        processname: processNames,
                        processest: processQuoAct
                     });
                     // console.log(finalJson)
                     next(null, finalJson);

                  }
               }

            })
         })
      })


   } catch (e) {
      console.log(e)
   }


}


module.exports.processreportExcelReport = function(req, res, next) {

   // console.log('generateXls');
   expenseReport(req, res, function(err, result) {
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
      var subTotalPreprocess = 0;
      var subTotalPostprocess = 0;
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
         'MM/DD/YYYY') : '');
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
         tbody.push(material[i].amount ? material[i].amount.toString() :
            '');
         subTotalA += material[i].amount ? material[i].amount : 0;
         body.push(tbody);
         tbody = [];
      }


      tbody.push('');
      tbody.push('');
      tbody.push('SUB TOTAL-A');
      tbody.push(subTotalA.toString());
      body.push(tbody);


      tbody = [];
      tbody.push('');
      tbody.push('PROCESS COST');
      tbody.push('HOURS X RATE');
      tbody.push('');
      body.push(tbody);

      tbody = [];
      tbody.push('');
      tbody.push('PRE-PROCESS ');
      tbody.push('');
      tbody.push('');
      body.push(tbody);


      tbody = [];
      for (i = 0; i < pRows; i++) {
         if (process[i].processtype === 'Preprocess') {
            tbody.push('');
            tbody.push(process[i].name);
            tbody.push(process[i].hours.toString() + ' X ' + process[i].rate
               .toString());
            tbody.push('');
            body.push(tbody);
            tbody = [];
            subTotalPreprocess += parseFloat(process[i].hours) * parseFloat(process[i].rate)
         }
      }


      tbody.push('');
      tbody.push('');
      tbody.push('SUB TOTAL-PREPROCESS');
      // subTotalB = process[0] ? process[0].actualCost : 0;
      tbody.push(subTotalPreprocess.toString());
      body.push(tbody);

      tbody = [];
      tbody.push('');
      tbody.push('POST-PROCESS ');
      tbody.push('');
      tbody.push('');
      body.push(tbody);


      tbody = [];
      for (i = 0; i < pRows; i++) {
         if (process[i].processtype === 'Postprocess') {
            tbody.push('');
            tbody.push(process[i].name);
            tbody.push(process[i].hours.toString() + ' X ' + process[i].rate
               .toString());
            tbody.push('');
            body.push(tbody);
            tbody = [];
            subTotalPostprocess += parseFloat(process[i].hours) * parseFloat(process[i].rate)
         }
      }


      tbody.push('');
      tbody.push('');
      tbody.push('SUB TOTAL-POSTPROCESS');
      // subTotalB = process[0] ? process[0].actualCost : 0;
      tbody.push(subTotalPostprocess.toString());
      body.push(tbody);

      tbody = [];
      // body.push(tbody);
      tbody.push('');
      tbody.push('');
      tbody.push('SUB TOTAL-B');
      subTotalB = subTotalPreprocess + subTotalPostprocess;
      tbody.push(subTotalB.toString());
      body.push(tbody);


      tbody = [];
      tbody.push('');
      tbody.push('SCRAP COST');
      tbody.push('SUB TOTAL-C');
      subTotalC = scrap;
      tbody.push(subTotalC.toString());
      body.push(tbody);

      tbody = [];
      tbody.push('TOTAL TOOLING COST');
      tbody.push('');
      tbody.push('A+B+C');
      totalToolingCost = subTotalA + subTotalB + subTotalC;
      tbody.push(totalToolingCost.toString());
      body.push(tbody);

      body[2][4] = (job.amount - totalToolingCost).toString();
      body[3][1] = (totalToolingCost).toString();

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

// module.exports.processReport = processReport;


function datenum(v, date1904) {
   if (date1904) v += 1462;
   var epoch = Date.parse(v);
   return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function updateSum() {
   var sum = parseFloat(job.materialamount) + parseFloat(job.processamount)
   job.amount = sum;
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
