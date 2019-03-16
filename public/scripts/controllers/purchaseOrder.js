'use strict';


myApp
   .controller('PurchaseOrderCtrl', ['themeInit', 'purchaseOrderService',
      'pageData', '$scope', '$uibModal', 'productPurchaseService', 'ginfo', 'server',
      function(themeInit, purchaseOrderService,
         pageData, $scope, $uibModal, productPurchaseService, ginfo, server) {
         // console.log('pageData[0]', pageData[0]);
         themeInit.dataTable();
         $scope.pageData = pageData;
         $scope.edit = function(data, i) {
            purchaseOrderService.modelDataIndex = i;
            purchaseOrderService.modelData = data;
         };
         $scope.delete = function() {
            purchaseOrderService.delete(purchaseOrderService.modelData, function(e, r) {
               if (r) {
                  if (purchaseOrderService.modelDataIndex > -1) {
                     $scope.pageData.splice(purchaseOrderService.modelDataIndex, 1);
                  }
               }
            });
         };

         $scope.updatePOStatus = function(x, status) {
            // if (x.poStatus == 'open') {
            //    x.poStatus = 'submitted';
            // } else if (x.poStatus == 'submitted') {
            //    x.poStatus = 'approved';
            // }
            purchaseOrderService.updatePOStatus(x, function(e, r) {
               if (!e)
                  x.poStatus = status;
            });
         };

         $scope.open = function(po) {
            return server.downloadPdf('POST', 'pdf/download', {
                  _id: po._id
               },
               function(err, data) {
                  if (!!err) {
                     console.log(err);
                  }
               });

            var modalInstance = $uibModal.open({
               // templateUrl: 'po_report/poReport.partial.html',
               template: '<iframe id="pdfV" style="width:100%; height: 500px" > </iframe>',
               controller: 'POReportModalCtrl',
               size: 'lg',
               resolve: {
                  productPurchaseList: productPurchaseService.productPurchaseList(po._id),
                  purchaseOrderInfo: productPurchaseService.purchaseOrderInfo(po._id)
               }
            });

            modalInstance.result.then(function(selectedItem) {
               // $scope.selected = selectedItem;
            }, function() {
               // $log.info('Modal dismissed at: ' + new Date());
            });
         };
      }
   ]);