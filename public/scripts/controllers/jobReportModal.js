'use strict';


myApp
   .controller('JobReportModalCtrl', ['$uibModalInstance', '$scope',
      'pageData', 'excel', 'themeInit',
      function($uibModalInstance, $scope,
         pageData, excel, themeInit) {

         $scope.pageData = pageData.jobData;
         $scope.A = pageData.constants.A;
         $scope.B = pageData.constants.B;
         $scope.C = pageData.constants.C;
         $scope.T = pageData.constants.T;
         $scope.P = pageData.constants.P;

         $scope.ok = function() {
            $uibModalInstance.close($scope.selected.item);
         };

         $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
         };

         $scope.exportToExcel = function(tableId) {
            excel.download(tableId, $scope.pageData[2].code ? $scope.pageData[2].code + '.xls' : 'Job Detail.xls');
         };

         // themeInit.dataTable({
         //    "paging": false,
         //    "ordering": false,
         //    "info": false
         // }, 'datatableJR');

      }
   ]);
