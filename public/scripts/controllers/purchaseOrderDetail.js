'use strict';


myApp
   .controller('PurchaseOrderDetailCtrl', ['purchaseOrderService', 'supplierList', '$scope', 'ginfo',
      function(purchaseOrderService, supplierList, $scope, ginfo) {
         $scope.purchaseOrder = purchaseOrderService.modelData;
         $scope.supplierList = supplierList;
         $scope.noAccess = false;
         $scope.noAccess = (ginfo.isUsr() && $scope.purchaseOrder.poStatus != 'open') ||
            ($scope.purchaseOrder.status == 'approved');
         $scope.select = function(data) {
            $scope.purchaseOrder.job = data.originalObject;
         };

         $scope.save = function() {
            purchaseOrderService.save($scope.purchaseOrder, function(e, r) {});
         };
      }
   ]);
