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

var ObjectID = require('mongodb').ObjectID;
var mongojs = require('mongojs')
var db = mongojs('prox')
var async = require("async");

var mongoClient = Promise.promisifyAll(require('mongodb')).MongoClient;


/* get expense report*/

var expenseReport = function (req, res, next) {
    try {
        var job = req.body.job;
        var job5 = req.body.job;
        var ssDate = req.body.sDate;
        var eeDate = req.body.eDate
        if( ssDate && eeDate) {
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

        if (ssDate && eeDate && job5) {
            job = {$and: [job, {'date': {'$gte': sDate,'$lte': eDate}}]};
        } else if (ssDate && eeDate) {
            job = {'date': {'$gte': sDate,'$lte': eDate}};
        }

        db.collection('jobs').find(job3, function (err, results0) {
            if (err) throw err
            db.collection('materials').find(job, function (err, results) {
                if (err) throw err
                db.collection('scraps').find(job, function (err, results2) {
                    if (err) throw err
                    db.collection('scrapefforts').find(job2, function (err, results3) {
                        if (err) throw err

                        var scrapCost = Array();
                        var scrapEffortCost = Array();
                        var processCost = Array();
                        var materialCost = Array();
                        var grandTotal = Array();
                        var temp;

                        /* calculate scrape cost*/
                        for (var i = 0; i < results0.length; i++) {
                            scrapCost[i] = 0;
                            for (var k = 0; k < results2.length; k++) {
                                var _id = (results0[i]._id).toString();
                                var jo_id = (results2[k].job).toString();
                                if (_id === jo_id) {
                                    scrapCost[i] += parseFloat(results2[k].amount);
                                }
                            }
                        }

                        /* calculate scrapeffort/process cost*/

                        for (var i = 0; i < results0.length; i++) {
                            scrapEffortCost[i] = 0;
                            processCost[i] = 0;
                            processCost[i] += parseFloat(results0[i].amount);
                            for (var l = 0; l < results3.length; l++) {
                                var _id = (results0[i]._id).toString();
                                var jo_id = (results3[l].job).toString();
                                if (_id === jo_id) {
                                    scrapEffortCost[i] += parseFloat(results3[l].totalEffortCost);
                                }
                            }

                        }

                        /* calculate material cost*/

                        for (var i = 0; i < results0.length; i++) {
                            materialCost[i] = 0;
                            for (var j = 0; j < results.length; j++) {
                                var _id = (results0[i]._id).toString();
                                var jo_id = (results[j].job).toString();
                                if (_id === jo_id) {
                                    materialCost[i] += parseFloat(results[j].amount);
                                }
                            }
                        }


                        /* create res final json object */


                        for (var i = 0; i < results0.length; i++) {
                            /* grand total*/
                            grandTotal[i] = scrapEffortCost[i] + materialCost[i] + processCost[i] + scrapCost[i];
                            var jsonObj = {
                                'job': results0[i]._id,
                                'jobid': results0[i].title.split('-')[0],
                                'jobname': results0[i].title.split('-')[1],
                                'totalscrapeffortcost': scrapEffortCost[i],
                                'totalmaterialcost': materialCost[i],
                                'totalprocesscost': processCost[i],
                                'totalscrapcost': scrapCost[i],
                                'grandTotal': grandTotal[i]
                            }
                            finalJson.push(jsonObj)
                        }


                        next(null, finalJson);
                    })

                })
            })
        })
    }catch (e){
        console.log(e)
    }

}


module.exports.expenseExcelReport = function (req, res, next) {

    // console.log('generateXls');
    expenseReport(req, res, function (err, result) {
        if (err) {
            console.log('Error : generateExcel : jobReport()', err);
            return next(err);
        }
        console.log('\nGot jobReport()\n :', result);
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

module.exports.expenseReport = expenseReport;


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