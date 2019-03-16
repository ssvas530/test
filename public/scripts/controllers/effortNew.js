'use strict';


myApp
   .controller('EffortNewCtrl', ['themeInit', 'effortService', '$scope', 'jobEffort', 'processList',
      '$stateParams', '$state', 'jobInfo', 'ginfo', 'jobService',
      function(themeInit, effortService, $scope, jobEffort, processList,
         $stateParams, $state, jobInfo, ginfo, jobService) {
         themeInit.validator();
         $scope.processList = processList;
         $scope.jobEffort = jobEffort;
         $scope.jobInfo = jobInfo;
         $scope.showMe = true;
         $scope.currentJobId = $stateParams.id;
         $scope.effort = {};
         $scope.effort.process = processList[0] ? processList[0] : '';

         $scope.select = function(data) {
            if (!data) {
               return ginfo.showMessage({
                  msg: "Please select a job",
                  type: 'error'
               });
            }
            // $scope.showMe = false;
            $state.go('effort.new', {
               id: data._id
            });
         };

         $scope.selectEmp = function(selectedEmp, x) {
            if (ginfo.isUsr()) {
               return;
            }
            if (this.$parent.x) {
               console.log('has $parent.x');
               this.$parent.x.user = selectedEmp ? selectedEmp.originalObject : '';
               return;
            }

            $scope.effort.user = selectedEmp ? selectedEmp.originalObject : '';
         };

         $scope.selectJob = function(job) {
            job = job.originalObject;
            if (ginfo.isAdmin()) {
               return;
            }
            if (this.$parent.x) {
               this.$parent.x.job = job;
               return;
            }

            $scope.effort.job = job;
         };

         $scope.onOpen = function(isOpen) {
            $scope.processList = [];
            var that = this;
            if (ginfo.isAdmin()) {
               return;
            }
            console.log('opened');
            if (!isOpen) return;
            var job;
            if (that.$parent.x) {
               job = that.$parent.x.job;
            } else {
               job = $scope.effort.job;
            }
            if (!job) {
               return ginfo.showMessage({
                  msg: 'Please select a job',
                  type: 'error'
               });
            }
            jobService.processList(job._id)
               .then(function(data) {
                  $scope.processList = data;
               });
         };

         $scope.jobSelected = function(job) {
            if (this.$parent.x) {
               this.$parent.x.job = job;
            }

            $scope.effort.job = job;
         };

         $scope.add = function(data) {
            if (ginfo.isAdmin() && !$scope.effort.user) {
               return ginfo.showMessage({
                  msg: 'Please select an employee',
                  type: 'error'
               });
            }
            if (ginfo.isAdmin()) {
               data.job = $scope.currentJobId;
            }
            // data.start = data.start ? moment(data.start, 'M/D/YY hh:mm a').valueOf() : null;
            // data.stop = data.stop ? moment(data.stop, 'M/D/YY hh:mm a').valueOf() : null;
            // data.total = 0;
            // data.overtime = 0;
            // if (data.stop && data.start) {
            //    data.total = data.stop - data.start;
            //    if (data.total < 0) {
            //       return ginfo.showMessage({
            //          msg: 'Start time cannot be greater than stop time',
            //          type: 'error'
            //       });
            //    }
            //    var stop = (new Date(data.start).getHours() > 17) ? (new Date(data.start).setHours(29, 30, 0, 0)) : (new Date(data.start).setHours(
            //       17, 30, 0, 0));
            //    data.overtime = (new Date(data.stop)) - stop;
            //    data.overtime = (data.overtime > 0) ? data.overtime : 0;
            //    data.overtime = ((data.total - data.overtime) < 34200000) ? 0 : (data.overtime - 34200000);
            //    console.log('Total :', data.total);
            //    console.log('Overtime :', data.overtime);
            // }
            // effortService.addEffort(angular.copy(data), function(e, r) {
            //    if (!e) {
            //       $state.reload('effort.new');
            //    }
            // });
            // data.start = data.start ? moment(data.start).format('M/D/YY hh:mm a') : null;
            // data.stop = data.stop ? moment(data.stop).format('M/D/YY hh:mm a') : null;
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
            effortService.addEffort(angular.copy(data), function(e, r) {
               if (!e) {
                  $state.reload('effort.new');
               }
            });
            data.start = data.start ? moment(data.start).format('DD/MM/YYYY hh:mm a') : null;
            data.stop = data.stop ? moment(data.stop).format('DD/MM/YYYY hh:mm a') : null;
         };

         $scope.update = function(data) {
            if (ginfo.isAdmin() && !data.user) {
               return ginfo.showMessage({
                  msg: 'Please select an employee',
                  type: 'error'
               });
            }
            // var st, sp;
            // st = data.start;
            // sp = data.stop;
            // data.start = data.start ? moment(data.start, 'M/D/YY hh:mm a').valueOf() : null;
            // data.stop = data.stop ? moment(data.stop, 'M/D/YY hh:mm a').valueOf() : null;
            // console.log('data.start', data.start);
            // data.total = 0;
            // data.overtime = 0;
            // if (data.stop && data.start) {
            //    data.total = data.stop - data.start;
            //    if (data.total < 0) {
            //       return ginfo.showMessage({
            //          msg: 'Start time cannot be greater than stop time',
            //          type: 'error'
            //       });
            //    }
            //    var stop = (new Date(data.start).getHours() > 17) ? (new Date(data.start).setHours(29, 30, 0, 0)) : (new Date(data.start).setHours(
            //       17, 30, 0, 0));
            //    data.overtime = (new Date(data.stop)) - stop;
            //    data.overtime = (data.overtime > 0) ? data.overtime : 0;
            //    data.overtime = ((data.total - data.overtime) < 34200000) ? 0 : (data.overtime - 34200000);
            //    console.log('Total :', data.total);
            //    console.log('Overtime :', data.overtime);
            // }
            // effortService.updateEffort(angular.copy(data), function(e, r) {});
            // data.start = data.start ? moment(data.start).format('M/D/YY hh:mm a') : null;
            // data.stop = data.stop ? moment(data.stop).format('M/D/YY hh:mm a') : null;
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
            effortService.deleteEffort($scope.temp, function(e, r) {});
         };

         $scope.edit = function(data) {
            $scope.temp = data;
         };

         $scope.setStartTime = function(x, y) {
            if (y) {
               return;
            }
            var date = moment().format('DD/MM/YYYY hh:mm a');
            x.start = date;
         };

         $scope.setStopTime = function(x, y) {
            if (y) {
               return;
            }
            var date = moment().format('DD/MM/YYYY hh:mm a');
            x.stop = date;
            // var date = new Date();
            // var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + ' ' +
            //    date.getHours() + ':' + date.getMinutes();
            // x.stop = datevalues;
         };

         $scope.options = {
            format: 'DD/MM/YYYY hh:mm a',
            showClear: true
         };

      }
   ]);
