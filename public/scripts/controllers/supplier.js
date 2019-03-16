'use strict';


myApp
   .controller('SupplierCtrl', ['themeInit', 'supplierService', 'pageData', '$scope',
      function(themeInit, supplierService,
         pageData, $scope) {
         // console.log('pageData[0]', pageData[0]);
         themeInit.dataTable();
         $scope.pageData = pageData;
         $scope.edit = function(data, i) {
            supplierService.modelDataIndex = i;
            supplierService.modelData = data;
         };
         $scope.delete = function() {
            supplierService.delete(supplierService.modelData, function(e, r) {
               if (r) {
                  if (supplierService.modelDataIndex > -1) {
                     $scope.pageData.splice(supplierService.modelDataIndex, 1);
                  }
               }
            });
         };
      }
   ]);
