'use strict';


myApp
   .controller('ClientDetailCtrl', ['clientService', '$scope', function(clientService, $scope) {
      $scope.client = clientService.modelData;
      $scope.save = function() {
         clientService.save($scope.client, function(e, r) {});
      };
   }]);
