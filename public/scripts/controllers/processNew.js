'use strict';


myApp
   .controller('ProcessNewCtrl', ['themeInit', 'processService', '$scope',
      function(themeInit, processService, $scope) {
         themeInit.validator();
         $scope.process = {};
         $scope.save = function() {
            processService.save($scope.process, function(e, r) {});
         };
      }
   ]);
