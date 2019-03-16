'use strict';


myApp
   .controller('RoleNewCtrl', ['themeInit', 'roleService', '$scope',
      function(themeInit, roleService, $scope) {
         themeInit.datePicker();
         $scope.save = function() {
            roleService.save($scope.role, function(e, r) {});
         };
      }
   ]);
