'use strict';


myApp
   .service('report4Service', ['server', '$q', '$state', '$stateParams', 'ginfo',
      function(server, $q, $state, $stateParams, ginfo) {

         this.processReport = function(obj) {
            var deferred = $q.defer();
            var pageData = [];
            server.crud('POST', 'empEffortReport/', obj,
               function(err, data) {
                  if (!!err) {} else {
                     pageData = data;
                  }
                  deferred.resolve(pageData);
               });
            return deferred.promise;
         };

         this.downloadFile = function(obj) {
            var deferred = $q.defer();
            var pageData = [];
            server.download('POST', 'empEffortReport/batch/download/', obj,
               function(err, data) {
                  if (!!err) {} else {
                     pageData = data;
                  }
                  deferred.resolve(pageData);
               });
            return deferred.promise;
         };

         this.getBatchInfo = function() {
            var deferred = $q.defer();
            var pageData = [];
            server.crud('GET', 'empEffortReport/batch/info/', null,
               function(err, data) {
                  if (!!err) {} else {
                     pageData = data;
                  }
                  deferred.resolve(pageData);
               });
            return deferred.promise;
         };

      }
   ]);
