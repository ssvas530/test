'use strict';


myApp
   .controller('ProductDetailCtrl', ['themeInit', 'productService', '$scope',
      function(themeInit, productService, $scope) {
         themeInit.validator();
         $scope.product = productService.modelData;
         $scope.save = function() {
            productService.save($scope.product, function(e, r) {});
         };
      }
   ]);
