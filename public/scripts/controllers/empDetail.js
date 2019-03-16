'use strict';


myApp
   .controller('EmpDetailCtrl', ['themeInit', 'empService', '$scope',
      function(themeInit, empService, $scope) {
         themeInit.datePicker();
         themeInit.validator();
         $scope.edit = true;
         $scope.user = empService.modelData;
         $scope.roleList = ['employee', 'admin', 'manager'];
         $scope.setGender = function(g) {
            $scope.user.gender = g;
         };
         $scope.save = function() {
            // $scope.user.dob = $('#datepicker').val();
            empService.save($scope.user, function(e, r) {});
         };
      }
   ]);
