'use strict';


myApp
   .controller('MaterialCtrl', ['themeInit', 'materialService', '$scope', 'materialList',
      'materialTList', 'supplierList', '$stateParams', '$state', 'jobInfo', '$filter', '$window',
      function(themeInit, materialService, $scope, materialList,
         materialTList, supplierList, $stateParams, $state, jobInfo, $filter, $window) {
         themeInit.validator();
         $scope.jobInfo = jobInfo;
         $scope.material = {};
         $scope.materialTList = materialTList;
         $scope.supplierList = supplierList;
         $scope.materialList = materialList;
         $scope.showMe = true;
         $scope.currentJobId = $stateParams.id;
         $scope.material.materialType = materialTList[0] ? materialTList[0] : '';
         $scope.material.supplier = supplierList[0] ? supplierList[0] : '';

         $scope.getTotal = function(obj) {
            if (!$scope.currentJobId) {
               return 0;
            }
            var total = 0;
            for (var i = 0; i < $scope.materialList.length; i++) {
               var material = $scope.materialList[i];
               total += material.amount || 0;
            }
            $scope.value = total;
         };
         $scope.getTotal();
         $scope.select = function(data) {
            // $scope.showMe = false;
            $state.go('record.material.list', {
               id: data._id
            });
         };

         $scope.add = function(data) {
            data.job = $scope.currentJobId;
            materialService.addMaterial(data, function(e, r) {
               $scope.getTotal();
            });
         };

         $scope.calculate = function(x) {
            x.amount = (x.rate * (parseInt(x.qty) || 0));
            // x.amount = $filter('currency')(x.amount, 2);
            $scope.getTotal();
         };

         $scope.update = function(data) {
            materialService.updateMaterial(data, function(e, r) {
               $scope.getTotal();
            });
         };

         $scope.delete = function() {
            materialService.deleteMaterial($scope.temp, function(e, r) {
               $scope.getTotal();
            });
         };

         $scope.edit = function(data) {
            $scope.temp = data;
         };
         $scope.editing = false;

         // ng-click handler to activate edit-in-place
         $scope.editable = function(name) {
            $scope.editing = true;
            $window.document.getElementById(name).focus();
         };

         $scope.onBlur = function() {
            $scope.editing = false;
         };

      }
   ]);
