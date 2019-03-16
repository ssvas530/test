'use strict';


myApp
   .controller('ProcessReportCtrl', ['themeInit', 'processreportService', '$scope', '$window',
      '$timeout', '$log', '$uibModal', 'jobService', 'excel',
      function(themeInit, processreportService, $scope, $window,
         $timeout, $log, $uibModal, jobService, excel) {
         $scope.pageData = {};
         $scope.defaultProcess = [];
         $scope.defaultProcessSingle = [];
         $scope.cSum = {};
         $scope.cSum.process = {};
         $scope.includeMe = false;
         themeInit.validator();
         themeInit.datePicker();
         var dtInitized = false;
         $scope.expense = {};
         // $scope.empList = empList;
         // $scope.jobList = jobList;

         function parseDate(input) {
            var parts = input.split('/');
            // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
            return new Date(parts[2], parts[0] - 1, parts[1]); // Note: months are 0-based
         }

         function searchDate(input) {
            var parts = input.split('/');
            // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
            return new Date(parts[1] + '/' + parts[0] + '/' + parts[2]);
         }


         $scope.selectJob = function(selectedJob) {
            $scope.expense.job = selectedJob ? selectedJob.originalObject : '';
         };
         $scope.find = function() {
            console.log('reached console')
            $scope.showMe = true;
            var sDate = $('#start').val();
            var eDate = $('#end').val();

            $scope.expense.gte = moment((searchDate(sDate)).setHours(0, 0, 0, 0)).toDate();
            $scope.expense.lte = moment((searchDate(eDate)).setHours(23, 59, 59, 999)).toDate();
            processreportService.processReport($scope.expense)
               .then(function(r) {
                  $scope.pageData = r;
                  $scope.defaultProcess = [];
                  $scope.defaultProcessSingle = [];
                  $scope.cSum = {};
                  $scope.cSum.process = {};
                  $scope.cSum = {};
                  $scope.cSum.process = {};
                  $scope.cSum.material = {
                     act: 0,
                     est: 0
                  };
                  $scope.cSum.processTotal = {
                     act: 0,
                     est: 0
                  };
                  $scope.cSum.total = {
                     act: 0,
                     est: 0
                  };
                  $scope.cSum.scrap = 0;
                  $scope.expense = {};
                  for (var i = 0; i < r.defaultProcess.length; i++) {
                     $scope.defaultProcess.push(r.defaultProcess[i]);
                     $scope.defaultProcess.push(r.defaultProcess[i]);
                     $scope.cSum.process[r.defaultProcess[i]] = {
                        act: 0,
                        est: 0
                     };
                  }
                  $scope.defaultProcessSingle = $scope.pageData.defaultProcess;
                  delete $scope.pageData.defaultProcess;
                  for (var key in $scope.pageData) {
                     var job = $scope.pageData[key];
                     job.totalActCost = job.totalActCost + (job.material ? job.material.act : 0);
                     job.totalActCost = job.totalActCost + (job.scrap ? job.scrap : 0);
                     job.totalActProcessCost = 0;
                     job.totalEstProcessCost = 0;
                     $scope.cSum.material.est = $scope.cSum.material.est + (job.totalMaterialCost ? job.totalMaterialCost : 0);
                     $scope.cSum.material.act = $scope.cSum.material.act + (job.material ? job.material.act : 0);
                     $scope.cSum.scrap = $scope.cSum.scrap + (job.scrap ? job.scrap : 0);
                     $scope.cSum.total.est = $scope.cSum.total.est + job.totalEstCost;
                     for (var p in job.process) {
                        var process = job.process[p];
                        process.act = process.total ? process.total * process.rate : 0;
                        process.est = process.estamount ? process.estamount : 0;
                        // console.log('$scope.cSum.process[p]', $scope.cSum.process[p]);
                        if ($scope.cSum.process[p]) {
                           $scope.cSum.process[p].act = parseFloat($scope.cSum.process[p].act) +
                              process.act;
                           $scope.cSum.process[p].est = parseFloat($scope.cSum.process[p].est) +
                              process.est;
                        }
                        job.totalActCost = job.totalActCost + process.act;
                        job.totalActProcessCost = job.totalActProcessCost + process.act;
                        job.totalEstProcessCost = job.totalEstProcessCost + process.est;
                        $scope.cSum.processTotal.act = $scope.cSum.processTotal.act + process.act;
                        $scope.cSum.processTotal.est = $scope.cSum.processTotal.est + (process.estamount ? process.estamount : 0);
                        process.act = process.act ? (process.act).toFixed(2) : '';
                     }
                     $scope.cSum.total.act = $scope.cSum.total.act + job.totalActCost;
                     $scope.cSum.materialBalance = $scope.cSum.material.est - $scope.cSum.material.act;
                     $scope.cSum.processBalance = $scope.cSum.processTotal.est - $scope.cSum.processTotal.act;
                  }
                  $scope.includeMe = true;
                  if (dtInitized) {
                     themeInit.dataTable({
                        "paging": false,
                        "ordering": false,
                        "info": false
                     }, 'datatable');
                     dtInitized = true;
                  }
               });
         };

         $scope.download = function() {
            $scope.showMe = true;
            var sDate = $('#start').val();
            var eDate = $('#end').val();
            $scope.effort.sDate = moment((new Date(sDate)).setHours(0, 0, 0, 0)).toDate();
            $scope.effort.eDate = moment((new Date(eDate)).setHours(23, 59, 59, 999)).toDate();
            effortService.downloadReport($scope.effort);

         };

         $scope.downloadpdf = function() {
            html2canvas(document.getElementById('exportthis'), {
               onrendered: function(canvas) {
                  var data = canvas.toDataURL();
                  var docDefinition = {
                     content: [{
                        image: data,
                        width: 500,
                     }]
                  };
                  pdfMake.createPdf(docDefinition).download("report.pdf");
               }
            });
         };

         // $scope.multiply = function(job, k, index, last) {
         //    if (!job)
         //       return 0;
         //    var result = 0;
         //    result = job.process[k] ? index % 2 === 0 ? job.process[k].estamount :
         //       (job.process[k].total * job.process[k].rate) : 0;
         //    result = result || 0;
         //    if (index % 2 === 0 && $scope.cSum.process[k] && result) {
         //       $scope.cSum.process[k].est = parseFloat($scope.cSum.process[k].est).toFixed(2) + result;
         //    } else if ($scope.cSum.process[k] && result) {
         //       // console.log('result , $scope.cSum.process[k].act', result, ',', $scope.cSum.process[k].act);
         //       $scope.cSum.process[k].act = parseFloat($scope.cSum.process[k].act).toFixed(2) + result;
         //    }
         //    return result.toFixed(2);
         // };


         $scope.exportToExcel = function(tableId) {
            excel.download(tableId, 'Job Estimated/Actual Report.xls');
         };


         $scope.open = function(job) {

            var modalInstance = $uibModal.open({
               templateUrl: 'partials/jobReport.html',
               controller: 'JobReportModalCtrl',
               size: 'lg',
               resolve: {
                  pageData: jobService.jobReport({
                        "job": {
                           _id: job._id
                        }
                     })
                     .then(function(r) {
                        var jobData = r;
                        var pageData = {};
                        var A = 0;
                        var B = 0;
                        var C = 0;
                        var T = 0;
                        var P = 0;
                        r[0].map(function(o) {
                           A += o.amount || 0;
                        });
                        r[1].map(function(o) {
                           B += (o.hours * o.rate) || 0;
                        });
                        C = r[3];
                        T = A + B + C;
                        P = r[2].amount - T;
                        pageData.jobData = jobData;
                        pageData.constants = {
                           A: A,
                           B: B,
                           C: C,
                           T: T,
                           P: P
                        };
                        return pageData;
                     })
               }
            });

            modalInstance.result.then(function(selectedItem) {
               // $scope.selected = selectedItem;
            }, function() {
               $log.info('Modal dismissed at: ' + new Date());
            });
         };

      }


   ]);