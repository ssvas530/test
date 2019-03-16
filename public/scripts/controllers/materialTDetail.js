'use strict';


myApp
   .controller('MaterialTDetailCtrl', ['materialTService', '$scope', function(materialTService, $scope) {
      $scope.materialT = materialTService.modelData;
      $scope.save = function() {
         materialTService.save($scope.materialT, function(e, r) {});
      };
   }]);
