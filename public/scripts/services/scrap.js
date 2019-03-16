'use strict';


myApp
   .service('scrapService', ['server', '$q', '$state', '$stateParams',
      function(server, $q, $state, $stateParams) {
         var user = {};

         this.modelData = {};
         this.modelDataIndex = -1;

         this.materialTList = function() {
            var deferred = $q.defer();
            var pageData = [];
            server.crud('GET', 'materialT/list', null, function(err, data) {
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


         this.scrapList = function(id) {
            if (!id) {
               return [];
            }
            var deferred = $q.defer();
            var pageData = [];
            server.crud('POST', 'scrap/jobScrap', {
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


         this.addScrap = function(data, cb) {
            var that = this;
            server.crud('POST', 'scrap/save', data, function(err, data) {
               if (!!err) {
                  return cb(true, null);
               }
               if ($stateParams.id) {
                  $state.reload();
               } else {
                  $state.go('record.scrap.list', {
                     id: $stateParams.id
                  });
               }
               return cb(null, true);
            });
         };


         this.updateScrap = function(data, cb) {
            var that = this;
            server.crud('POST', 'scrap/update', data, function(err, data) {
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
               $state.go('record.scrap.list', {
                  id: $stateParams.id
               });
            }
         };

         this.deleteScrap = function(data, cb) {
            var that = this;
            server.crud('POST', 'scrap/delete', data, function(err, data) {
               if (!!err) {
                  return cb(true, null);
               }
               if ($stateParams.id) {
                  $state.reload();
               } else {
                  $state.go('record.scrap.list', {
                     id: $stateParams.id
                  });
               }
            });
         };


      }
   ]);
