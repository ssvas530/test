'use strict';


myApp
   .controller('RoleCtrl', ['themeInit', 'roleService', 'pageData', '$scope',
      function(themeInit, roleService,
         pageData, $scope) {
         themeInit.dataTable();
         $scope.pageData = pageData;
         $scope.edit = function(data, i) {
            roleService.modelDataIndex = i;
            roleService.modelData = data;
         };
         $scope.delete = function() {
            roleService.delete(roleService.modelData, function(e, r) {
               if (r) {
                  if (roleService.modelDataIndex > -1) {
                     $scope.pageData.splice(roleService.modelDataIndex, 1);
                  }
               }
            });
         };
      }
   ]);
