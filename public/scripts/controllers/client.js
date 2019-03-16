'use strict';


myApp
   .controller('ClientCtrl', ['themeInit', 'clientService', 'pageData', '$scope',
      function(themeInit, clientService,
         pageData, $scope) {
         // console.log('pageData[0]', pageData[0]);
         themeInit.dataTable();
         $scope.pageData = pageData;
         $scope.edit = function(data, i) {
            console.log('clicked');
            clientService.modelDataIndex = i;
            clientService.modelData = data;
         };
         $scope.delete = function() {
            clientService.delete(clientService.modelData, function(e, r) {
               if (r) {
                  if (clientService.modelDataIndex > -1) {
                     pageData.splice(clientService.modelDataIndex, 1);
                  }
               }
            });
         };
      }
   ]);
