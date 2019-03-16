'use strict';


myApp
   .controller('DepartmentNewCtrl', ['themeInit', 'departmentService', '$scope',
      function(themeInit, departmentService, $scope) {
         themeInit.datePicker();
         $scope.save = function() {
            departmentService.save($scope.department, function(e, r) {});
         };
      }
   ]);
