'use strict';


myApp
   .controller('ProductNewCtrl', ['themeInit', 'productService', '$scope',
      function(themeInit, productService, $scope) {
         themeInit.validator();
         $scope.product = {};
         themeInit.datePicker();
         $scope.save = function() {
            productService.save($scope.product, function(e, r) {});
         };
      }
   ]);
