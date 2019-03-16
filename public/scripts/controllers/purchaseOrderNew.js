'use strict';


myApp
   .controller('PurchaseOrderNewCtrl', ['themeInit', 'purchaseOrderService', '$scope',
      'supplierList', 'ginfo', 'productList', 'productPurchaseList', '$stateParams',
      'productPurchaseService', '$state', 'purchaseOrderInfo',
      function(themeInit, purchaseOrderService, $scope,
         supplierList, ginfo, productList, productPurchaseList, $stateParams,
         productPurchaseService, $state, purchaseOrderInfo) {
         themeInit.datePicker();
         $scope.supplierList = supplierList;
         $scope.purchaseOrder = {};
         $scope.canBeEdited = false;
         if (purchaseOrderInfo) {
            $scope.canBeEdited = true;
            $scope.purchaseOrder = purchaseOrderInfo; //purchaseOrderService.modelData
         }
         $scope.purchaseOrder.supplier = supplierList[0] ? supplierList[0] : '';
         $scope.noAccess = false;
         $scope.noAccess = ($scope.purchaseOrder.poStatus != null) && (ginfo.isUsr() && $scope.purchaseOrder.poStatus != 'open') ||
            ($scope.purchaseOrder.status == 'approved');

         $scope.save = function() {
            purchaseOrderService.save($scope.purchaseOrder, function(e, r) {});
         };
         // product list
         // themeInit.dataTable();
         themeInit.validator();
         $scope.pp = {};
         $scope.description = "";
         $scope.productList = productList;
         $scope.productPurchaseList = productPurchaseList;
         $scope.showMe = true && $scope.purchaseOrder._id;
         $scope.currentJobId = $stateParams.id;
         // $scope.pp.product = productList[0] ? productList[0] : '';
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
            $scope.purchaseOrder.totalAmount = $scope.value;
            purchaseOrderService.updateTotal($scope.purchaseOrder, function(e, r) {});
         };
         if ($stateParams.id) {
            $scope.getTotal();
            updatePO();
         }

         $scope.select = function(data) {
            if (data)
               $scope.purchaseOrder.job = data.originalObject;
         };

         $scope.inputChanged = function(name) {
            $scope.selectedObject = undefined;
            $scope.pp.materialType = {};
            if (name) {
               $scope.pp.materialType.name = name;
            }
         };

         $scope.add = function(data) {
            data.purchaseOrder = $scope.currentJobId;
            if ($scope.selectedObject) {
               data.materialType = $scope.selectedObject.originalObject;
            }
            data.job = $scope.purchaseOrder.job._id ? $scope.purchaseOrder.job._id : $scope.purchaseOrder.job;
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
