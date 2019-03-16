'use strict';


myApp
   .service('effortService', ['server', '$q', '$state', '$stateParams', 'ginfo',
      function(server, $q, $state, $stateParams, ginfo) {

         this.list = function() {
            var deferred = $q.defer();
            var pageData = [];
            server.crud('GET', 'effort', null,
               function(err, data) {
                  if (!!err) {} else {
                     if (angular.isArray(data)) {
                        pageData = data;
                     } else {
                        pageData.push(data);
                     }
                  }
                  deferred.resolve(pageData);
               });
            return deferred.promise;
         };

         this.jobEffort = function(id) {
            // if (!id) {
            //    return [];
            // }
            var deferred = $q.defer();
            var pageData = [];
            server.crud('POST', 'effort/jobEffort', {
                  _id: id
               },
               function(err, data) {
                  if (!!err) {} else {
                     if (angular.isArray(data)) {
                        pageData = data;
                     } else {
                        pageData.push(data);
                     }
                  }
                  for (var i = 0; i < pageData.length; i++) {
                     pageData[i].start = pageData[i].start ? moment(pageData[i].start).format('DD/MM/YYYY hh:mm a') : null;
                     pageData[i].stop = pageData[i].stop ? moment(pageData[i].stop).format('DD/MM/YYYY hh:mm a') : null;
                  }
                  console.log('pageData', pageData);
                  deferred.resolve(pageData);
               });
            return deferred.promise;
         };

         this.jobEffortFindOne = function(job, effort) {
            if (!(job || effort)) {
               gingo.showMessage({
                  msg: 'No job or effort id found'
               });
               return [];
            }
            var deferred = $q.defer();
            var pageData = [];
            server.crud('POST', 'effort/jobEffortFindOne', {
                  job: job,
                  effort: effort
               },
               function(err, data) {
                  if (!!err) {} else {
                     if (angular.isArray(data)) {
                        pageData = data;
                     } else {
                        pageData.push(data);
                     }
                  }
                  if (pageData[0]) {
                     pageData[0].start = pageData[0].start ? moment(pageData[0].start).format('MM/DD/YYYY hh:mm a') : null;
                     pageData[0].stop = pageData[0].stop ? moment(pageData[0].stop).format('MM/DD/YYYY hh:mm a') : null;
                  }
                  deferred.resolve(pageData);
               });
            return deferred.promise;
         };

         this.addEffort = function(data, cb) {
            var that = this;
            server.crud('POST', 'effort/save', data, function(err, data) {
               if (!!err) {
                  return cb(true, null);
               }
               if ($stateParams.id) {
                  $state.reload();
               } else {
                  $state.go('effort.list', {
                     id: $stateParams.id
                  });
               }
               return cb(null, true);
            });
         };

         this.userList = function() {
            var deferred = $q.defer();
            var that = this;
            if (ginfo.getUser().role == 'employee') {
               return [];
            }
            server.crud('GET', 'user', null, function(err, data) {
               if (!!err) {}
               deferred.resolve(data);
            });
            return deferred.promise;
         };

         this.updateEffort = function(data, cb) {
            var that = this;
            server.crud('POST', 'effort/update', data, function(err, data) {
               if (!!err) {
                  return cb(true, null);
               }
               if ($stateParams.id && $stateParams.effort) {
                  $state.go('effort.list');
               }
               return cb(null, true);
            });
         };

         this.cancel = function() {
            if ($stateParams.id) {
               $state.reload();
            } else {
               $state.go('effort.list', {
                  id: $stateParams.id
               });
            }
         };

         this.deleteEffort = function(data, cb) {
            var that = this;
            server.crud('POST', 'effort/delete', data, function(err, data) {
               if (!!err) {
                  return cb(true, null);
               }
               if ($stateParams.id && $stateParams.effort) {
                  $state.go('effort.list');
               }
               if ($stateParams.id) {
                  $state.reload();
               } else {
                  $state.go('effort.list', {
                     id: $stateParams.id
                  });
               }
            });
         };

         this.effortReport = function(obj) {
            var deferred = $q.defer();
            var pageData = [];
            server.crud('POST', 'effort/effortReport', obj,
               function(err, data) {
                  if (!!err) {} else {
                     pageData = data;
                  }
                  deferred.resolve(pageData);
               });
            return deferred.promise;
         };

         this.downloadReport = function(obj) {
            server.download('POST', 'effort/download/excelReport', obj,
               function(err, data) {
                  if (!!err) {
                     console.log(err);
                  }
               });
         };

      }
   ]);
