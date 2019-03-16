'use strict';


myApp
   .service('scrapEffortService', ['server', '$q', '$state', '$stateParams',
      function(server, $q, $state, $stateParams) {

         this.list = function() {
            var deferred = $q.defer();
            var pageData = [];
            server.crud('GET', 'scrapEffort', null,
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

         this.jobScrapEffort = function(id) {
            if (!id) {
               return [];
            }
            var deferred = $q.defer();
            var pageData = [];
            server.crud('POST', 'scrapEffort/jobScrapEffort', {
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


         this.addScrapEffort = function(data, cb) {
            var that = this;
            server.crud('POST', 'scrapEffort/save', data, function(err, data) {
               if (!!err) {
                  return cb(true, null);
               }
               if ($stateParams.id) {
                  $state.reload();
               } else {
                  $state.go('scrapEffort.list', {
                     id: $stateParams.id
                  });
               }
               return cb(null, true);
            });
         };

         this.totalEffortCost = function(data, a, cb) {
            var that = this;
            server.crud('POST', 'effort/totalEffortCost', data, function(err, data) {
               if (!!err) {
                  console.log('error ::', err);
               }
               console.log('sum::', data);

               a.totalEffortCost = data;
               cb();
            });
         };

         this.updateScrapEffort = function(data, cb) {
            var that = this;
            server.crud('POST', 'scrapEffort/update', data, function(err, data) {
               if (!!err) {
                  return cb(true, null);
               }
               return cb(null, true);
            });
         };

         this.cancel = function() {
            if ($stateParams.id) {
               $state.reload();
            } else {
               $state.go('scrapEffort.list', {
                  id: $stateParams.id
               });
            }
         };

         this.deleteScrapEffort = function(data, cb) {
            var that = this;
            server.crud('POST', 'scrapEffort/delete', data, function(err, data) {
               if (!!err) {
                  return cb(true, null);
               }
               if ($stateParams.id) {
                  $state.reload();
               } else {
                  $state.go('scrapEffort.list', {
                     id: $stateParams.id
                  });
               }
            });
         };

         this.partNoList = function(id) {
            var deferred = $q.defer();
            var pageData = [];
            if (!id) {
               return [];
            }
            server.crud('POST', 'effort/partNo', {
                  job: id
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


      }
   ]);
