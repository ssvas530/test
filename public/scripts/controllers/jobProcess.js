'use strict';


myApp
   .controller('JobProcessCtrl', ['themeInit', 'jobService', '$scope', 'processList', '$stateParams', 'jobInfo',
      function(themeInit, jobService, $scope, processList, $stateParams, jobInfo) {
         themeInit.validator();
         $scope.jobInfo = jobInfo;
         $scope.job = jobService.modelData;
         $scope.processList = processList;
         $scope.showMe = true;
         $scope.currentJobId = $stateParams.id;
         $scope.getTotal = function() {
            if (!$scope.currentJobId) {
               return 0;
            }
            var total = 0;
            for (var i = 0; i < $scope.processList.length; i++) {
               var process = $scope.processList[i];
               total += parseFloat(process.rate) || 0;
            }
            $scope.value = total;
         };
         $scope.getTotal();
         $scope.add = function(data) {
            data.job = $stateParams.id;
            jobService.addProcess(data, function(e, r) {});
            $scope.getTotal();
         };

         $scope.update = function(data) {
            jobService.updateProcess(data, function(e, r) {});
            $scope.getTotal();
         };

         $scope.delete = function() {
            jobService.deleteProcess($scope.temp, function(e, r) {});
            $scope.getTotal();
         };

         $scope.edit = function(data) {
            $scope.temp = data;
         };

      }
   ]);
