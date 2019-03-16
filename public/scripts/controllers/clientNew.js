'use strict';


myApp
   .controller('ClientNewCtrl', ['themeInit', 'clientService', '$scope',
      function(themeInit, clientService, $scope) {
         themeInit.datePicker();
         $scope.save = function() {
            clientService.save($scope.client, function(e, r) {});
         };
      }
   ]);
