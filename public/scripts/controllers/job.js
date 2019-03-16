'use strict';


myApp
   .controller('JobCtrl', ['themeInit', 'jobService', 'pageData', '$scope',
      function(themeInit, jobService,
         pageData, $scope) {
         themeInit.dataTable();
         $scope.pageData = pageData;
         $scope.edit = function(data, i) {
            jobService.modelDataIndex = i;
            jobService.modelData = data;
         };

         $scope.showMe = function(data) {
            console.log(data.activity);
            if (data.activity === 'active')
               return true;
            else
               return false;
         }

         $scope.activity = function(data, i, j) {

            if (j === 1)
               jobService.activityActive(data, function(e, r) {
                  data.activity = 'active';
               });
            else
               jobService.activityInactive(data, function(e, r) {
                  data.activity = 'inactive';
               });

         }

         $scope.delete = function() {
            jobService.delete(jobService.modelData, function(e, r) {
               if (r) {
                  if (jobService.modelDataIndex > -1) {
                     $scope.pageData.splice(jobService.modelDataIndex, 1);
                  }
               }
            });
         };
      }
   ]);
