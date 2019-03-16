'use strict';


myApp
   .controller('RoleDetailCtrl', ['roleService', '$scope', function(roleService, $scope) {
      $scope.role = roleService.modelData;
      $scope.save = function() {
         roleService.save($scope.role, function(e, r) {});
      };
   }]);
