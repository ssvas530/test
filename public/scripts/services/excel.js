myApp
   .factory('excel', ['$timeout', '$window', function($timeout, $window) {

      var uri = 'data:application/vnd.ms-excel;base64,',
         template =
         '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
         base64 = function(s) {
            return $window.btoa(unescape(encodeURIComponent(s)));
         },
         format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
               return c[p];
            });
         },
         ctx = {};

      var tableToExcel = function(tableId, worksheetName) {
         var table = $(tableId),
            ctx = {
               worksheet: worksheetName,
               table: table.html()
            },
            href = uri + base64(format(template, ctx));
         return href;
      };

      var download = function(tableId, fileName) {
         var exportHref = tableToExcel(tableId, 'sheet 1');
         $timeout(function() {
            var browser = window.navigator.appVersion;
            if ((browser.indexOf('Trident') !== -1 && browser.indexOf('rv:11') !== -1) ||
               (browser.indexOf('MSIE 10') !== -1)) {
               var builder = new window.MSBlobBuilder();
               builder.append(exportHref + format(template, ctx));
               var blob = builder.getBlob('data:application/vnd.ms-excel');
               window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
               var a = document.createElement('a');
               a.href = exportHref;
               a.download = fileName || 'download.xls';
               a.click();
            }
         }, 100);
      };
      return {
         tableToExcel: tableToExcel,
         download: download
      };
   }]);
