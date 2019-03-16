'use strict';


myApp
   .controller('ScrapEffortCtrl', ['themeInit', 'scrapEffortService', '$scope', 'pageData',
      '$stateParams', '$state',
      function(themeInit, scrapEffortService, $scope, pageData,
         $stateParams, $state) {

         themeInit.validator();
         $scope.scrapEffortList = pageData;

         $scope.select = function(data) {
            $scope.showMe = false;
            $state.go('scrapEffort.list', {
               id: data._id
            });
         };

         $scope.mark4Delete = function(data) {
            $scope.toDelete = data;
         };

         $scope.delete = function() {
            scrapEffortService.deleteScrapEffort($scope.toDelete, function(e, r) {});
         };

         $scope.edit = function(data) {
            $scope.temp = data;
            $state.go('scrapEffort.new', {
               id: data.job._id
            });
         };

      }
   ]);
