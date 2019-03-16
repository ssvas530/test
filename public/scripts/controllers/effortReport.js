'use strict';


myApp
   .controller('EffortReportCtrl', ['themeInit', 'effortService', '$scope',
      function(themeInit, effortService, $scope) {

         themeInit.datePicker();
         $scope.effort = {};
         // $scope.empList = empList;
         // $scope.jobList = jobList;

         function parseDate(input) {
            var parts = input.split('/');
            // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
            return new Date(parts[2], parts[0] - 1, parts[1]); // Note: months are 0-based
         }

         function searchDate(input) {
            var parts = input.split('/');
            // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
            return new Date(parts[1] + '/' + parts[0] + '/' + parts[2]);
         }


         $scope.selectJob = function(selectedJob) {
            $scope.effort.job = selectedJob ? selectedJob.originalObject : '';
         };

         $scope.selectEmp = function(selectedEmp) {
            $scope.effort.emp = selectedEmp ? selectedEmp.originalObject : '';
         };

         $scope.find = function() {
            $scope.showMe = true;
            var sDate = $('#start').val();
            var eDate = $('#end').val();

            $scope.effort.sDate = moment((searchDate(sDate)).setHours(0, 0, 0, 0)).toDate();
            $scope.effort.eDate = moment((searchDate(eDate)).setHours(23, 59, 59, 999)).toDate();
            effortService.effortReport($scope.effort)
               .then(function(r) {
                  $scope.pageData = r;
                  themeInit.dataTable();

               });
         };

         $scope.download = function() {
            $scope.showMe = true;
            var sDate = $('#start').val();
            var eDate = $('#end').val();
            $scope.effort.sDate = moment((new Date(sDate)).setHours(0, 0, 0, 0)).toDate();
            $scope.effort.eDate = moment((new Date(eDate)).setHours(23, 59, 59, 999)).toDate();
            effortService.downloadReport($scope.effort);

         };

         $scope.hourMinuteTotal = function(time) {
            if (!time) return '0';
            var h = parseInt(time / 3600000);
            var m = parseInt((time % 3600000) / 60000);
            return h + ' h ' + m + ' m ';
         };
         $scope.calculateTotal = function(filteredArray) {
            var totalh = 0;
            var totaly = 0;
            var time = 0;
            var arr = [];
            var arr2 = [];
            var h = 0;
            var m = 0;
            angular.forEach(filteredArray, function(x) {
               totalh = x.overtime;
               totaly = x.total;
               time = parseInt(totaly - totalh);
               if (!time) {
                  h = 0;
                  m = 0;
               } else {
                  h = parseInt(time / 3600000);
                  m = parseInt((time % 3600000) / 60000);
               }

               arr.push(h);
               arr2.push(m)
            });
            var h2 = 0
            for (i = 0; i < arr.length; i++) {
               h2 += arr[i];
            }
            var m2 = 0
            for (i = 0; i < arr2.length; i++) {
               m2 += arr2[i];
            }

            if (m2 < 60)
               return h2 + ' h ' + m2 + ' m ';
            else {
               return (h2 + parseInt(m2 / 60)) + ' h ' + (m2 % 60) + ' m ';
            }


         };


         $scope.calculateTotal2 = function(filteredArray) {
            var totalh = 0;
            var totaly = 0;
            var time = 0;
            var arr = [];
            var arr2 = [];
            var h = 0;
            var m = 0;
            angular.forEach(filteredArray, function(x) {
               totalh = x.overtime;
               time = parseInt(totalh);
               if (!time) {
                  h = 0;
                  m = 0;
               } else {
                  h = parseInt(time / 3600000);
                  m = parseInt((time % 3600000) / 60000);
               }

               arr.push(h);
               arr2.push(m)
            });
            var h2 = 0
            for (i = 0; i < arr.length; i++) {
               h2 += arr[i];
            }
            var m2 = 0
            for (i = 0; i < arr2.length; i++) {
               m2 += arr2[i];
            }
            if (m2 < 60)
               return h2 + ' h ' + m2 + ' m ';
            else {
               return (h2 + parseInt(m2 / 60)) + ' h ' + (m2 % 60) + ' m ';
            }

         };

         $scope.calculateTotal3 = function(filteredArray) {
            var totalh = 0;
            var totaly = 0;
            var time = 0;
            var arr = [];
            var arr2 = [];
            var h = 0;
            var m = 0;
            angular.forEach(filteredArray, function(x) {
               totalh = x.overtime;
               time = parseInt(totalh);
               if (!time) {
                  h = 0;
                  m = 0;
               } else {
                  h = parseInt(time / 3600000);
                  m = parseInt((time % 3600000) / 60000);
               }

               arr.push(h);
               arr2.push(m)
            });
            var h2 = 0
            for (i = 0; i < arr.length; i++) {
               h2 += arr[i];
            }
            var m2 = 0
            for (i = 0; i < arr2.length; i++) {
               m2 += arr2[i];
            }

            // second

            var totalh7 = 0;
            var totaly7 = 0;
            var time7 = 0;
            var arr7 = [];
            var arr72 = [];
            var h7 = 0;
            var m7 = 0;
            angular.forEach(filteredArray, function(x) {
               totalh7 = x.overtime;
               totaly7 = x.total;
               time7 = parseInt(totaly7 - totalh7);
               if (!time7) {
                  h7 = 0;
                  m7 = 0;
               } else {
                  h7 = parseInt(time7 / 3600000);
                  m7 = parseInt((time7 % 3600000) / 60000);
               }

               arr7.push(h7);
               arr72.push(m7)
            });
            var h72 = 0
            for (i = 0; i < arr7.length; i++) {
               h72 += arr7[i];
            }
            var m72 = 0
            for (i = 0; i < arr72.length; i++) {
               m72 += arr72[i];
            }

            var ht = h2 + h72;
            var mt = m2 + m72;
            var hf;

            if (mt < 60)
               return ht + ' h ' + mt + ' m ';
            else {
               return (ht + parseInt(mt / 60)) + ' h ' + (mt % 60) + ' m ';
            }

         };





         $scope.hourMinute = function(time) {
            if (!time) return '0';
            var h = parseInt(time / 3600000);
            var m = parseInt((time % 3600000) / 60000);
            return h + ' h ' + m + ' m ';
         };

      }
   ]);