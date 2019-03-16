'use strict';


myApp
   .controller('POReportModalCtrl', ['$uibModalInstance', '$scope',
      'purchaseOrderInfo', 'productPurchaseList', 'themeInit', '$filter',
      function($uibModalInstance, $scope,
         purchaseOrderInfo, productPurchaseList, themeInit, $filter) {

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

         // playground requires you to assign document definition to a variable called dd

         function toDataURL(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url);
            xhr.responseType = 'blob';
            xhr.onload = function() {
               var fr = new FileReader();

               fr.onload = function() {
                  callback(this.result);
               };

               fr.readAsDataURL(xhr.response); // async call
            };
            xhr.send();
         }
         var setFooter = function(data) {
            return {

               columns: [{
                  alignment: 'center',
                  text: [{
                        text: data.approvedBy ? data.approvedBy.name : '_________________',
                        decoration: 'underline'
                     },
                     '\nApproved By:'
                  ]
               }, '', {
                  alignment: 'center',
                  text: [{
                        text: data.requestedBy ? data.requestedBy.name : '_________________',
                        decoration: 'underline'
                     },
                     '\nName & Signature of Requestor\nF-EPU-001 Rev04 (02.03.2015)'
                  ]
               }],
               margin: [25, 0]
            };
         };

         var setStyle = {
            header: {
               fontSize: 18,
               bold: true
            },
            bigger: {
               fontSize: 15,
               italics: true
            }
         };

         var createHeader = function(dd, finalImg, data, nextPage) {
            if (nextPage)
               dd.content.push({
                  text: '.',
                  pageBreak: 'before'
               });
            dd.content.push({
               alignment: 'center',
               columns: [{
                  width: 90,
                  // text: '',
                  image: finalImg,
                  height: 50
               }, {
                  width: '*',
                  text: ''
               }, {
                  width: '*',
                  text: ''
               }, {
                  width: 180,
                  text: 'Cicor Ecotool Pte Ltd\n Fax: 6545 0032/ Tel: 6545 5030\n\nDate: ' +
                     (data.createdAt ? ($filter('date')(data.createdAt,
                        "dd-MM-yyyy")) : '') + '\nRef No:' + data.refNo
               }]
            });
            dd.content.push({
               height: 100,
               text: '\n\n'
            });
            dd.content.push({
               alignment: 'left',
               margin: [25, 0],
               text: 'PURCHASE REQUISITION FORM'
            });
            dd.content.push({
               height: 50,
               text: '\n'
            });
         };

         var createPage = function(dd, finalImg, data, productPurchaseList, nextPage) {
            var item;
            for (var i = 0; i < productPurchaseList.length; i++) {
               item = productPurchaseList[i];
               if (i % 14 === 0) {
                  if (i === 0)
                     createHeader(dd, finalImg, data, false);
                  else {
                     createSubFooter(dd, data);
                     createHeader(dd, finalImg, data, true);
                  }
                  dd.content.push({
                     style: 'tableExample',
                     color: '#444',
                     margin: [25, 0],
                     table: {
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        headerRows: 1,
                        heights: 30,
                        // keepWithHeaderRows: 1,
                        body: [
                           [{
                              text: 'S/N',
                              style: 'tableHeader'
                           }, {
                              text: 'Item No.',
                              style: 'tableHeader'
                           }, {
                              text: 'Description',
                              style: 'tableHeader'
                           }, {
                              text: 'Qty',
                              style: 'tableHeader'
                           }, {
                              text: 'Unit Price',
                              style: 'tableHeader'
                           }, {
                              text: 'Required Date',
                              style: 'tableHeader'
                           }, {
                              text: 'Del Date',
                              style: 'tableHeader'
                           }],
                           [i + 1, item.materialType.name, item.name,
                              item.qty, item.rate, (item.created ? ($filter('date')(item.created,
                                 "dd-MM-yyyy")) : ''), ''
                           ]
                        ]
                     }
                  });
                  if (i === productPurchaseList.length - 1) {
                     createSubFooter(dd, data);
                  }
               } else {
                  dd.content[dd.content.length - 1].table.body.push([i + 1,
                     item.materialType.name, item.name, item.qty,
                     item.rate, (item.created ? ($filter('date')(item.created,
                        "dd-MM-yyyy")) : ''), ''
                  ]);
                  if (i === productPurchaseList.length - 1) {
                     createSubFooter(dd, data);
                  }
               }
            }
            // console.log(i);
            // console.log('\ndd.content', dd.content);
            // dd.content.push({
            //    style: 'tableExample',
            //    color: '#444',
            //    table: {
            //       widths: ['50%', '42%'],
            //       // headerRows: 1,
            //       // keepWithHeaderRows: 1,
            //       body: [
            //          [{
            //             text: 'P/O No: ' + data.poNumber ? data.poNumber : ''
            //          }, {
            //             text: 'Supplier: ' + data.supplier.name
            //          }],
            //          [{
            //             colSpan: 2,
            //             text: 'Reason for Purchase : ' + data.reason ? data.reason : '' +
            //                '\n Job No: ' + data.job ? data.job.name : '' + '\n Remarks: ' +
            //                data.remark ? data.remark : ''
            //          }, {}]
            //       ]
            //    }
            // });
         };
         var createSubFooter = function(dd, data) {
            dd.content.push({
               height: 50,
               text: '.'
            });
            dd.content.push({
               margin: [25, 0],
               columns: [{
                  width: '50%',
                  // alignment: 'center',
                  text: "P/O No: " + (data.poNumber ? data.poNumber : "")
               }, {
                  width: '50%',
                  // alignment: 'center',
                  text: "Supplier: " + (data.supplier ? data.supplier.name : '')
               }]
            });
            dd.content.push({
               margin: [25, 0],
               text: 'Reason for Purchase : ' + (data.reason ? data.reason : '') +
                  '\n Job No: ' + (data.job ? data.job.name : '') + '\n Remarks: ' + (data.remark ? data.remark : '')
            });
         };

         var flag = 'assets/images/pr_format.png';
         var finalImg;
         var dd = {};
         toDataURL(flag, function(base64Image) {
            // finalImg.push(base64Image);
            finalImg = base64Image;
            dd = {
               content: [],
               styles: setStyle,
               defaultStyle: {
                  columnGap: 20
               },
               footer: setFooter(purchaseOrderInfo),
               pageMargins: [30, 30, 30, 60]
            };
            createPage(dd, finalImg, purchaseOrderInfo, productPurchaseList);
            // pdfMake.createPdf(dd).open();
            pdfMake.createPdf(dd).getDataUrl(function(outDoc) {
               document.getElementById('pdfV').src = outDoc;
               //download pdf custom name
               pdfMake.createPdf(dd).download(($filter('date')((new Date()),
                     "dd-MM-yyyy")) + (purchaseOrderInfo.refNo ? ('_' + purchaseOrderInfo.refNo) : "") +
                  (purchaseOrderInfo.job ? ('_' + purchaseOrderInfo.job.name) : ''));
            });
         });



      }
   ]);