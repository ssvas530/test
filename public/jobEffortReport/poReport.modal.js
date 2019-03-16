'use strict';


myApp
   .controller('POReportModalCtrl', ['$uibModalInstance', '$scope',
      'purchaseOrderInfo', 'productPurchaseList', 'themeInit',
      function($uibModalInstance, $scope,
         purchaseOrderInfo, productPurchaseList, themeInit) {

         $scope.purchaseOrderInfo = purchaseOrderInfo;
         // console.log('purchaseOrderInfo', purchaseOrderInfo);
         // console.log('productPurchaseList', productPurchaseList);
         $scope.productPurchaseList = productPurchaseList;
         $scope.ok = function() {
            $uibModalInstance.close($scope.selected.item);
         };

         $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
         };

         $scope.printReport = function(tableId) {

         };
         $scope.printDiv = function(divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var popupWin = window.open('', '_blank', 'width=300,height=300');
            popupWin.document.open();
            popupWin.document.write(
               '<html><head><link rel="stylesheet" type="text/css" href="po_report/style.css" /></head><body onload="window.print()">' +
               printContents +
               '</body></html>');
            popupWin.document.close();
         };

         // themeInit.dataTable({
         //    "paging": false,
         //    "ordering": false,
         //    "info": false
         // }, 'datatableJR');

      }
   ]);
