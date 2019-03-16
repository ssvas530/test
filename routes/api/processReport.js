var express = require('express');
var router = express.Router();
var Effort = require('../../controllers').effort;
var Job = require('../../controllers').job;
var ProcessReport = require('../../controllers').processReport;
var Middleware = require('./middleware');
var path = require('path');
var mime = require('mime');
var fs = require('fs');


router.get('/searchJob/:name', Middleware.isAuthenticated, function(req, res, next) {
    Job.searchJob(req, res, function(err, dat) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        return res.status(200).send({
            result: dat,
            status: 200
        });
    });
});


router.post('/processreport', Middleware.isAuthenticated, function(req, res, next) {
    ProcessReport.processReport(req, res, function(err, dat) {
        if (err) {
            console.log(err + 'reached here');
            return res.status(500).send(err);
        }
        return res.status(200).send({
            result: dat,
            status: 200
        });
    });
});

router.post('/download/processExcelReport', function(req, res) {

    ProcessReport.processExcelReport(req, res, function(err, file) {
        if (err) {
            return res.status(500).send({
                status: 500,
                message: 'Error while creating excel'
            });
        }
        console.log('Sending excel');

        var filename = path.basename(file.path);
        var mimetype = mime.lookup(file.path);

        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file.path);
        filestream.pipe(res);
    }, function(error) {
        console.log('Error Sending excel');
        res.send('ERROR:' + error);
    });

});

module.exports = router;