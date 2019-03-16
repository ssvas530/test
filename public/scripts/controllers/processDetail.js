'use strict';


myApp
   .controller('ProcessDetailCtrl', ['themeInit', 'processService', '$scope',
      function(themeInit, processService, $scope) {
         themeInit.validator();
         $scope.process = processService.modelData;
         $scope.save = function() {
            processService.save($scope.process, function(e, r) {});
         };
      }
   ]);
