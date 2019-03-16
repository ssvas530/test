'use strict';


myApp
   .controller('SupplierDetailCtrl', ['supplierService', '$scope', function(supplierService, $scope) {
      $scope.supplier = supplierService.modelData;
      $scope.save = function() {
         supplierService.save($scope.supplier, function(e, r) {});
      };
   }]);
