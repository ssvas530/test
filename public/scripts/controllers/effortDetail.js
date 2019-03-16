'use strict';


myApp
   .controller('EffortDetailCtrl', ['themeInit', 'effortService', '$scope', 'jobEffort', 'processList',
      '$stateParams', '$state', 'jobInfo', 'userList', 'ginfo',
      function(themeInit, effortService, $scope, jobEffort, processList,
         $stateParams, $state, jobInfo, userList, ginfo) {

         themeInit.validator();
         $scope.userList = userList;
         $scope.processList = processList;
         $scope.jobEffort = jobEffort;
         $scope.jobInfo = jobInfo;
         $scope.showMe = true;
         $scope.currentJobId = $stateParams.id;

         $scope.selectEmp = function(selectedEmp, x) {
            if (this.$parent.x) {
               this.$parent.x.user = selectedEmp ? selectedEmp.originalObject : '';
            }
         };

         $scope.update = function(data) {
            // return console.log(data);
            if (!data.user) {
               return ginfo.showMessage({
                  msg: 'Please select an employee',
                  type: 'error'
               });
            }
            var st, sp;
            st = data.start;
            sp = data.stop;
            data.start = data.start ? moment(data.start, 'DD/MM/YYYY hh:mm a').valueOf() : null;
            data.stop = data.stop ? moment(data.stop, 'DD/MM/YYYY hh:mm a').valueOf() : null;
            data.total = 0;
            data.overtime = 0;
            if (data.stop && data.start) {
               data.total = data.stop - data.start;
               if (data.total < 0) {
                  return ginfo.showMessage({
                     msg: 'Start time cannot be greater than stop time',
                     type: 'error'
                  });
               }
               var stop;
               if ((new Date(data.start).getHours() > 7) && (new Date(data.start).getHours() < 21)) {
                  stop = (new Date(data.start).setHours(17, 30, 0, 0));
               } else if ((new Date(data.start).getHours() < 8)) {
                  stop = (new Date(data.start).setHours(5, 30, 0, 0));
               } else {
                  stop = (new Date(data.start).setHours(29, 30, 0, 0));
               }
               data.overtime = (new Date(data.stop)) - stop;
               data.overtime = (data.overtime > 0) ? data.overtime : 0;
               console.log('Total :', data.total);
               console.log('Overtime :', data.overtime);
            }
            effortService.updateEffort(angular.copy(data), function(e, r) {});
            data.start = data.start ? moment(data.start).format('DD/MM/YYYY hh:mm a') : null;
            data.stop = data.stop ? moment(data.stop).format('DD/MM/YYYY hh:mm a') : null;
         };

         $scope.delete = function() {
            effortService.deleteEffort($scope.temp, function(e, r) {
               if (!e) {
                  $state.go('effort.list');
               }
            });
         };

         $scope.edit = function(data) {
            $scope.temp = data;
         };

         $scope.setStartTime = function(x, y) {
            console.log('stopped');
            if (y) {
               return;
            }
            var date = moment().format('DD/MM/YYYY hh:mm a');
            x.start = date;
         };

         $scope.setStopTime = function(x, y) {
            console.log('stopped');
            if (y) {
               return;
            }
            var date = moment().format('DD/MM/YYYY hh:mm a');
            x.stop = date;
         };

         $scope.options = {
            format: 'DD/MM/YY hh:mm a',
            showClear: true
         };
      }
   ]);
