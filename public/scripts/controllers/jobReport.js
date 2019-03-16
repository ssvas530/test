'use strict';


myApp
   .controller('JobReportCtrl', ['themeInit', 'jobService', '$scope', 'ginfo', 'excel', 'server',
      function(themeInit, jobService, $scope, ginfo, excel, server) {
         $scope.pageData = [
            [],
            [],
            []
         ];
         $scope.report = {};
         //currently the id is datatableJR hence this code wont work
         //and anyway the datatable is breaking due to some issues hence cant set the correct name.
         themeInit.dataTable({
            "paging": false,
            "ordering": false,
            "info": false
         });
         themeInit.datePicker();

         $scope.select = function(selectedJob) {
            $scope.report.job = selectedJob ? selectedJob.originalObject : '';
            $scope.showMe = true;
         };

         $scope.find = function() {
            if (!$scope.report.job) {
               return ginfo.showMessage({
                  msg: 'Please select a job',
                  type: 'error'
               });
            }
            $scope.showMe = true;
            var sDate = $('#start').val();
            var eDate = $('#end').val();
            $scope.report.sDate = moment((new Date(sDate)).setHours(0, 0, 0, 0)).toDate();
            $scope.report.eDate = moment((new Date(eDate)).setHours(23, 59, 59, 999)).toDate();
            jobService.jobReport($scope.report)
               .then(function(r) {
                  $scope.pageData = r;
                  $scope.A = 0;
                  $scope.B = 0;
                  $scope.C = 0;
                  $scope.T = 0;
                  $scope.P = 0;
                  r[0].map(function(o) {
                     $scope.A += o.amount || 0;
                  });
                  r[1].map(function(o) {
                     $scope.B += (o.hours * o.rate) || 0;
                  });
                  $scope.C = r[3];
                  $scope.T = $scope.A + $scope.B + $scope.C;
                  $scope.P = r[2].amount - $scope.T;

                  $scope.pi.data = [{
                     key: "Material Cost",
                     y: parseFloat($scope.A) || 0
                  }, {
                     key: "Process Cost",
                     y: parseFloat($scope.B) || 0
                  }, {
                     key: "Scrap Cost",
                     y: parseFloat($scope.C) || 0
                  }];
                  $scope.bar.data = [{
                     key: "Cumulative Return",
                     values: [{
                        "label": "Estimated",
                        "value": parseFloat(r[2].amount.toFixed(2)) || 0.00
                     }, {
                        "label": "Total",
                        "value": parseFloat($scope.T.toFixed(2)) || 0.00
                     }]
                  }];
               });
            // themeInit.dataTable({
            //    "columnDefs": [{
            //       "defaultContent": "-",
            //       "targets": "_all"
            //    }]
            // }, 'datatableJR');


         };

         $scope.download = function() {
            if (!$scope.report.job) {
               return ginfo.showMessage({
                  msg: 'Please select a job',
                  type: 'error'
               });
            }
            $scope.showMe = true;
            var sDate = $('#start').val();
            var eDate = $('#end').val();
            $scope.report.sDate = moment((new Date(sDate)).setHours(0, 0, 0, 0)).toDate();
            $scope.report.eDate = moment((new Date(eDate)).setHours(23, 59, 59, 999)).toDate();
            jobService.downloadReport($scope.report);

         };
         $scope.pi = {};
         $scope.bar = {};
         $scope.pi.data = [];
         $scope.bar.data = [];
         $scope.pi.options = {
            chart: {
               type: 'pieChart',
               height: 450,
               x: function(d) {
                  return d.key;
               },
               y: function(d) {
                  return d.y + (1e-10);
               },
               showLabels: true,
               valueFormat: function(d) {
                  return d3.format(',.2f')(d);
               },
               duration: 300,
               labelThreshold: 0.01,
               labelSunbeamLayout: false,
               legend: {
                  margin: {
                     top: 5,
                     right: 35,
                     bottom: 5,
                     left: 0
                  }
               }
            }
         };
         $scope.bar.options = {
            chart: {
               type: 'discreteBarChart',
               height: 450,
               margin: {
                  top: 20,
                  right: 20,
                  bottom: 50,
                  left: 70
               },
               x: function(d) {
                  return d.label;
               },
               y: function(d) {
                  return d.value + (1e-10);
               },
               showValues: true,
               valueFormat: function(d) {
                  return d3.format(',.2f')(d);
               },
               duration: 500,
               xAxis: {
                  // axisLabel: 'X Axis'
               },
               yAxis: {
                  // axisLabel: 'Y Axis',
                  axisLabelDistance: -10
               }
            }
         };
         $scope.exportToExcel = function(tableId) {
            excel.download(tableId, 'Job Report.xls');
         };
         $scope.downloadExcel = function() {
            if (!$scope.report.job) {
               return ginfo.showMessage({
                  msg: 'Please select a job',
                  type: 'error'
               });
            }
            $scope.showMe = true;
            var sDate = $('#start').val();
            var eDate = $('#end').val();
            $scope.report.sDate = moment((new Date(sDate)).setHours(0, 0, 0, 0)).toDate();
            $scope.report.eDate = moment((new Date(eDate)).setHours(23, 59, 59, 999)).toDate();
            return server.downloadExcel('POST', 'excel/jobReport', $scope.report,
               function(err, data) {
                  if (!!err) {
                     console.log(err);
                  }
               });

         }

      }
   ]);