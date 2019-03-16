'use strict';


myApp
   .controller('DepartmentDetailCtrl', ['departmentService', '$scope', function(departmentService, $scope) {
      $scope.department = departmentService.modelData;
      $scope.save = function() {
         departmentService.save($scope.department, function(e, r) {});
      };
   }]);
