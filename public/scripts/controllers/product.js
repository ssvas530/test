'use strict';


myApp
   .controller('ProductCtrl', ['themeInit', 'productService', 'pageData', '$scope',
      function(themeInit, productService,
         pageData, $scope) {

         themeInit.dataTable();
         $scope.pageData = pageData;

         $scope.edit = function(data, i) {
            productService.modelDataIndex = i;
            productService.modelData = data;
         };

         $scope.delete = function() {
            productService.delete(productService.modelData, function(e, r) {
               if (r) {
                  if (productService.modelDataIndex > -1) {
                     $scope.pageData.splice(productService.modelDataIndex, 1);
                  }
               }
            });
         };

      }
   ]);
