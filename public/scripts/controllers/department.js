'use strict';


myApp
   .controller('DepartmentCtrl', ['themeInit', 'departmentService', 'pageData', '$scope',
      function(themeInit, departmentService,
         pageData, $scope) {
         // console.log('pageData[0]', pageData[0]);
         themeInit.dataTable();
         $scope.pageData = pageData;
         $scope.edit = function(data, i) {
            departmentService.modelDataIndex = i;
            departmentService.modelData = data;
         };
         $scope.delete = function() {
            departmentService.delete(departmentService.modelData, function(e, r) {
               if (r) {
                  if (departmentService.modelDataIndex > -1) {
                     $scope.pageData.splice(departmentService.modelDataIndex, 1);
                  }
               }
            });
         };
      }
   ]);
