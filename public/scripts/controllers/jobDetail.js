'use strict';


myApp
   .controller('JobDetailCtrl', ['themeInit', 'jobService', '$scope', 'clientList',
      function(themeInit, jobService, $scope, clientList) {
         themeInit.validator();
         $scope.edit = true;
         $scope.job = jobService.modelData;
         $scope.hideMe = false;
         $scope.clientList = clientList;
         $scope.save = function() {
            jobService.save($scope.job, function(e, r) {});
         };
      }
   ]);
