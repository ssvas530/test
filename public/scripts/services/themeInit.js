// 'use strict';

myApp
   .service('themeInit', ['$timeout', function($timeout) {
      this.datePicker = function() {
         $timeout(function() {
            // jQuery('#datepicker').addClass('myAdd');
            jQuery('#datepicker').datepicker();
            jQuery('#date-range').datepicker({
               toggleActive: true
            });
         }, 0);
      };
      this.validator = function() {
         $timeout(function() {
            $('form').parsley();
         }, 0);
      };
      this.dataTable = function(options, elementId, buttons) {
         if (buttons)
            TableManageButtons.init();
         $timeout(function() {
            // console.log('linked html ');
            if (elementId)
               $('#' + elementId).dataTable(options);
            else
               $('#datatable').dataTable(options);
         }, 0);
      };
   }]);