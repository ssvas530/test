'use strict';


myApp
   .controller('MaterialTNewCtrl', ['themeInit', 'materialTService', '$scope',
      function(themeInit, materialTService, $scope) {
         themeInit.datePicker();
         $scope.save = function() {
            materialTService.save($scope.materialT, function(e, r) {});
         };
      }
   ]);
