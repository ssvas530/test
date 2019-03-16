'use strict';


myApp
   .controller('SupplierNewCtrl', ['themeInit', 'supplierService', '$scope', function(themeInit, supplierService, $scope) {
      themeInit.datePicker();
      $scope.save = function() {
         supplierService.save($scope.supplier, function(e, r) {});
      };
   }]);
