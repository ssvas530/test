'use strict';


myApp
   .controller('EmpNewCtrl', ['themeInit', 'empService', '$scope',
      function(themeInit, empService, $scope) {
         themeInit.datePicker();
         themeInit.validator();
         $scope.user = {};
         $scope.roleList = ['employee', 'admin', 'manager'];
         $scope.user.role = $scope.roleList[0];
         $scope.setGender = function(g) {
            $scope.user.gender = g;
         };
         $scope.save = function() {
            // $scope.user.dob = $('#datepicker').val();
            empService.save($scope.user, function(e, r) {});
         };
      }
   ]);
