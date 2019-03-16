'use strict';


myApp
   .controller('EffortCtrl', ['themeInit', 'effortService', '$scope', 'pageData',
      '$stateParams', '$state',
      function(themeInit, effortService, $scope, pageData,
         $stateParams, $state) {
          themeInit.dataTable({
              columnDefs: [
                  { type: 'dd/mm/YY', targets: 5 }
              ]
          });
          themeInit.validator();
         $scope.effortList = pageData;

         $scope.select = function(data) {
            $scope.showMe = false;
            $state.go('effort.list', {
               id: data._id
            });
         };

         $scope.mark4Delete = function(data) {
            $scope.toDelete = data;
         };

         $scope.delete = function() {
            effortService.deleteEffort($scope.toDelete, function(e, r) {});
         };

         $scope.edit = function(data) {
            $scope.temp = data;
            $state.go('effort.detail', {
               id: data.job._id,
               effort: data._id
            });
         };
    
    


         $scope.hourMinute = function(time) {
            if (!time) return '0';
            var h = parseInt(time / 3600000);
            var m = parseInt((time % 3600000) / 60000);
            return h + ' h ' + m + ' m';
         };

      }
   ]);
