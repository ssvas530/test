'use strict';


myApp
   .controller('EmpCtrl', ['themeInit', 'empService', 'pageData', '$scope',
      function(themeInit, empService,
         pageData, $scope) {
         // console.log('pageData[0]', pageData[0]);
         themeInit.dataTable();
         $scope.pageData = pageData;
         $scope.edit = function(data, i) {
            empService.modelDataIndex = i;
            empService.modelData = data;
         };
         $scope.delete = function() {
            empService.delete(empService.modelData, function(e, r) {
               if (r) {
                  if (empService.modelDataIndex > -1) {
                     $scope.pageData.splice(empService.modelDataIndex, 1);
                  }
               }
            });
         };
      }
   ]);
