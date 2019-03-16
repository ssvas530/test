'use strict';


myApp
   .controller('ProductPurchaseCtrl', ['themeInit', 'productPurchaseService', '$scope',
      'productList', 'productPurchaseList', '$stateParams', '$state', 'purchaseOrderInfo',
      'purchaseOrderService',
      function(themeInit, productPurchaseService, $scope,
         productList, productPurchaseList, $stateParams, $state, purchaseOrderInfo,
         purchaseOrderService) {
         themeInit.validator();
         $scope.purchaseOrderInfo = purchaseOrderInfo;
         $scope.pp = {};
         $scope.productList = productList;
         $scope.productPurchaseList = productPurchaseList;
         $scope.showMe = true;
         $scope.currentJobId = $stateParams.id;
         $scope.pp.product = productList[0] ? productList[0] : '';
         $scope.getTotal = function(obj) {
            if (!$scope.currentJobId) {
               return 0;
            }
            var total = 0;
            for (var i = 0; i < $scope.productPurchaseList.length; i++) {
               var pp = $scope.productPurchaseList[i];
               total += parseFloat(pp.amount) || 0;
            }
            $scope.value = total;
         };

         var updatePO = function() {
            $scope.getTotal();
            purchaseOrderInfo.totalAmount = $scope.value;
            purchaseOrderService.updateTotal(purchaseOrderInfo, function(e, r) {});
         };

         $scope.getTotal();
         updatePO();
         $scope.select = function(data) {
            // $scope.showMe = false;
            $state.go('record.productPurchase.list', {
               id: data._id
            });
         };

         $scope.add = function(data) {
            data.purchaseOrder = $scope.currentJobId;
            productPurchaseService.add(data, function(e, r) {});
         };

         $scope.calculate = function(x) {
            x.amount = (x.rate * (parseInt(x.qty) || 0));
            x.amount = Math.round(x.amount * 100) / 100;
            $scope.getTotal();
         };

         $scope.update = function(data) {
            productPurchaseService.update(data, function(e, r) {
               updatePO();
            });
         };

         $scope.delete = function() {
            productPurchaseService.delete($scope.temp, function(e, r) {});
         };

         $scope.edit = function(data) {
            $scope.temp = data;
         };

               }
   ]);
