'use strict';


myApp
   .controller('JobNewCtrl', ['themeInit', 'jobService', '$scope', 'clientList',
      function(themeInit, jobService, $scope, clientList) {
         themeInit.validator();
         $scope.clientList = clientList;
         $scope.job = {};
         $scope.job.client = clientList[0] ? clientList[0] : '';
         $scope.save = function() {
            jobService.save($scope.job, function(e, r) {});
         };
      }
   ]);
