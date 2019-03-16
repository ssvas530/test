'use strict';


myApp
   .controller('ProcessCtrl', ['themeInit', 'processService', 'pageData', '$scope',
      function(themeInit, processService,
         pageData, $scope) {

         themeInit.dataTable();
         $scope.pageData = pageData;

         $scope.edit = function(data, i) {
            processService.modelDataIndex = i;
            processService.modelData = data;
         };

         $scope.delete = function() {
            processService.delete(processService.modelData, function(e, r) {
               if (r) {
                  if (processService.modelDataIndex > -1) {
                     $scope.pageData.splice(processService.modelDataIndex, 1);
                  }
               }
            });
         };

      }
   ]);
