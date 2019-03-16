'use strict';


myApp
   .controller('ScrapCtrl', ['themeInit', 'scrapService', '$scope', 'scrapList',
      'materialTList', '$stateParams', '$state', 'jobInfo',
      function(themeInit, scrapService, $scope, scrapList,
         materialTList, $stateParams, $state, jobInfo) {
         themeInit.validator();
         $scope.material = {};
         $scope.jobInfo = jobInfo;
         console.log('jobInfo', jobInfo);
         $scope.materialTList = materialTList;
         $scope.scrapList = scrapList;
          // $scope.options={
          //     format: 'yyyy-mm-dd'
          // };
          $scope.showMe = true;
         $scope.currentJobId = $stateParams.id;
         $scope.material.materialType = materialTList[0] ? materialTList[0] : '';
         $scope.getTotal = function() {
            if (!$scope.currentJobId) {
               return 0;
            }
            var total = 0;
            for (var i = 0; i < $scope.scrapList.length; i++) {
               var material = $scope.scrapList[i];
               total += parseFloat(material.amount) || 0;
            }
            $scope.value = total;
         };
         $scope.getTotal();
         $scope.select = function(data) {
            // $scope.showMe = false;
            $state.go('record.scrap.list', {
               id: data._id
            });
         };

         $scope.add = function(data) {
            data.job = $scope.currentJobId;
            scrapService.addScrap(data, function(e, r) {
               $scope.getTotal();
            });
         };

         $scope.update = function(data) {
            scrapService.updateScrap(data, function(e, r) {
               $scope.getTotal();
            });
         };

         $scope.delete = function() {
            scrapService.deleteScrap($scope.temp, function(e, r) {
               $scope.getTotal();
            });
         };

         $scope.edit = function(data) {
            $scope.temp = data;
         };

      }
   ]);
