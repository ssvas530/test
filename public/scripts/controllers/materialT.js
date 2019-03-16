'use strict';


myApp
   .controller('MaterialTCtrl', ['themeInit', 'materialTService', 'pageData', '$scope',
      function(themeInit, materialTService,
         pageData, $scope) {
         // console.log('pageData[0]', pageData[0]);
         themeInit.dataTable();
         $scope.pageData = pageData;
         $scope.edit = function(data, i) {
            materialTService.modelDataIndex = i;
            materialTService.modelData = data;
         };
         $scope.delete = function() {
            materialTService.delete(materialTService.modelData, function(e, r) {
               if (r) {
                  if (materialTService.modelDataIndex > -1) {
                     $scope.pageData.splice(materialTService.modelDataIndex, 1);
                  }
               }
            });
         };
      }
   ]);
