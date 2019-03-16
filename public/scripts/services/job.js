'use strict';


myApp
   .service('jobService', ['server', '$q', '$state', function(server, $q, $state) {
      var user = {};
      this.modelData = {};
      this.modelDataIndex = -1;

      this.list = function() {
         var deferred = $q.defer();
         var pageData = [];

         server.crud('GET', 'job', null, function(err, data) {
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

      this.clientList = function() {
         var deferred = $q.defer();
         var pageData = [];
         server.crud('GET', 'client/clientList', null, function(err, data) {
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


      this.processList = function(id) {
         var deferred = $q.defer();
         var pageData = [];
         server.crud('POST', 'process/jobProcess', {
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
               deferred.resolve(pageData);
            });
         return deferred.promise;
      };

      this.save = function(data, cb) {
         var that = this;
         server.crud('POST', 'job/save', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            that.modelDataIndex = -1;
            that.modelData = {};
            $state.go('record.job.list');
            return cb(null, true);
         });
      };



      this.activityActive = function(data, cb) {
         var that = this;
         server.crud('POST', 'job/activity', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            that.modelDataIndex = -1;
            that.modelData = {};
            // $state.go('record.job.list');
            // $state.reload();
            return cb(null, true);
         });
      };

      this.activityInactive = function(data, cb) {
         var that = this;
         server.crud('POST', 'job/inactivity', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            that.modelDataIndex = -1;
            that.modelData = {};
            // $state.go('record.job.list');
            // $state.reload();
            return cb(null, true);
         });
      };


      this.addProcess = function(data, cb) {
         var that = this;
         server.crud('POST', 'process/addJobProcess', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            $state.reload();
            return cb(null, true);
         });
      };


      this.updateProcess = function(data, cb) {
         var that = this;
         server.crud('POST', 'process/updateJobProcess', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            return cb(null, true);
         });
      };

      this.cancel = function() {
         $state.go('record.job.list');
      };

      this.delete = function(data, cb) {
         var that = this;
         server.crud('POST', 'job/delete', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            $state.reload();
            return cb(null, true);
         });
      };


      this.deleteProcess = function(data, cb) {
         var that = this;
         server.crud('POST', 'process/deleteJobProcess', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            $state.reload();
            return cb(null, true);
         });
      };

      this.jobInfo = function(id) {
         var deferred = $q.defer();
         var pageData = [];
         server.crud('POST', 'job/jobInfo', {
               _id: id
            },
            function(err, data) {
               if (!!err) {} else {
                  pageData = data;
               }
               deferred.resolve(pageData);
            });
         return deferred.promise;
      };


      this.jobReport = function(obj) {
         var deferred = $q.defer();
         var pageData = [];
         server.crud('POST', 'job/jobReport', obj,
            function(err, data) {
               if (!!err) {} else {
                  pageData = data;
               }
               deferred.resolve(pageData);
            });
         return deferred.promise;
      };

      this.downloadReport = function(obj) {
         server.download('POST', 'job/download/excelReport', obj,
            function(err, data) {
               if (!!err) {
                  console.log(err);
               }
            });
      };

   }]);
