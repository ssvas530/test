'use strict';


myApp
   .controller('Report4Ctrl', ['themeInit', 'report4Service', '$scope', '$state',
      '$timeout', '$log', '$uibModal', 'jobService', 'excel', 'ginfo',
      function(themeInit, report4Service, $scope, $state,
         $timeout, $log, $uibModal, jobService, excel, ginfo) {
         $scope.pageData = {};
         $scope.row = [];
         $scope.columnEmp = [];
         $scope.columnProcess = [];
         $scope.validId = {};
         $scope.tarray = [];
         $scope.includeMe = false;
         themeInit.validator();
         themeInit.datePicker();
         var dtInitized = false;
         $scope.expense = {};

         function searchDate(input) {
            var parts = input.split('/');
            return new Date(parts[1] + '/' + parts[0] + '/' + parts[2]);
         }

         $scope.selectJob = function(selectedJob) {
            $scope.expense.job = selectedJob ? selectedJob.originalObject : '';
         };

         $scope.findOld = function() {
            // if (!$scope.expense.job) {
            //    return ginfo.showMessage({
            //       type: 'error',
            //       msg: 'please select a job'
            //    });
            // }
            $scope.showMe = true;
            var sDate = $('#start').val();
            var eDate = $('#end').val();

            $scope.expense.gte = moment((searchDate(sDate)).setHours(0, 0, 0, 0)).toDate();
            $scope.expense.lte = moment((searchDate(eDate)).setHours(23, 59, 59, 999)).toDate();
            report4Service.processReport($scope.expense)
               .then(function(r) {
                  console.log(r);
                  $scope.pageData = r.data;
                  $scope.row = r.row;
                  $scope.columnProcess = r.columnProcess;
                  $scope.columnEmp = r.columnEmp;
                  console.log('rowcount: ', $scope.row.length);
                  console.log('colcount: ', $scope.columnEmp.length);
                  $scope.validId = r.validId;
                  $scope.tarray = r.tarray;
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


         $scope.exportToExcel = function(tableId) {
            excel.download(tableId, 'Job Estimated/Actual Report.xls');
         };

         //get(pageData, 'job.process.user')
         $scope.get = function(obj, key) {
            console.log('executing....');
            return key.split(".").reduce(function(o, x) {
               return (typeof o == "undefined" || o === null) ? o : o[x];
            }, obj);
         };

         $scope.find = function() {
            $scope.disableMe = true;
            $scope.showMe = true;
            var sDate = $('#start').val();
            var eDate = $('#end').val();

            $scope.expense.gte = moment((searchDate(sDate)).setHours(0, 0, 0, 0)).toDate();
            $scope.expense.lte = moment((searchDate(eDate)).setHours(23, 59, 59, 999)).toDate();
            report4Service.processReport($scope.expense)
               .then(function(r) {
                  // $window.location.reload();
                  $state.reload('report4');
                  console.log(r);
                  $scope.pageData = r.data;
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

         $scope.getBatchInfo = function() {
            report4Service.getBatchInfo()
               .then(function(r) {
                  $scope.showMe = true;
                  console.log(r);
                  $scope.pageData = r.data;
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

         $scope.downloadFile = function(id, name) {
            report4Service.downloadFile({
                  _id: id,
                  fileName: name
               })
               .then(function(r) {});
         };

         $scope.getBatchInfo();
      }


   ]);
