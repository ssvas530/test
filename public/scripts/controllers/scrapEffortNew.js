'use strict';


myApp
   .controller('ScrapEffortNewCtrl', ['themeInit', 'scrapEffortService', '$scope', 'jobScrapEffort', 'partNoList',
      '$stateParams', '$state', 'jobInfo', 'ginfo',
      function(themeInit, scrapEffortService, $scope, jobScrapEffort, partNoList,
         $stateParams, $state, jobInfo, ginfo) {

         themeInit.validator();
         $scope.partNoList = partNoList;
         $scope.jobScrapEffort = jobScrapEffort;
         $scope.jobInfo = jobInfo;
         $scope.showMe = true;
         $scope.currentJobId = $stateParams.id;
         $scope.scrapEffort = {};
         $scope.scrapEffort.partNo = partNoList[0] ? partNoList[0] : '';

         $scope.getTotal = function() {
            var total = 0;
            for (var i = 0; i < $scope.jobScrapEffort.length; i++) {
               var cost = $scope.jobScrapEffort[i];
               total += parseFloat(cost.scrapCost) || 0;
            }
            $scope.sETotal = total;
         };

         $scope.select = function(data) {
            if (!data) {
               return ginfo.showMessage({
                  msg: "Please select a job",
                  type: 'error'
               });
            }
            $scope.showMe = false;
            $state.go('scrapEffort.new', {
               id: data._id
            });
         };

         $scope.add = function(data) {
            data.job = $scope.currentJobId;
            scrapEffortService.addScrapEffort(data, function(e, r) {});
         };

         $scope.updateEffortCost = function(x) {
            var data = {};
            data.job = $scope.currentJobId;
            data.partNo = x.partNo;
            scrapEffortService.totalEffortCost(data, x, function() {
               $scope.calculate(x);
            });
         };

         if ($scope.currentJobId) {
            $scope.scrapEffort.partNo = partNoList[0];
            $scope.updateEffortCost($scope.scrapEffort);
         }

         $scope.calculate = function(x) {
            x.scrapCost = ((x.totalEffortCost / x.totalQty) * x.scrapQty);
            x.scrapCost = Math.round(x.scrapCost * 100) / 100;
            $scope.getTotal();
         };

         $scope.update = function(data) {
            scrapEffortService.updateScrapEffort(data, function(e, r) {});
         };

         $scope.delete = function() {
            scrapEffortService.deleteScrapEffort($scope.temp, function(e, r) {});
         };

         $scope.edit = function(data) {
            $scope.temp = data;
         };
      }
   ]);
