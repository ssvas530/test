'use strict';


myApp
   .service('materialService', ['server', '$q', '$state', '$stateParams',
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

         this.supplierList = function() {
            var deferred = $q.defer();
            var pageData = [];
            server.crud('GET', 'supplier/list', null, function(err, data) {
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


         this.materialList = function(id) {
            if (!id) {
               return [];
            }
            var deferred = $q.defer();
            var pageData = [];
            server.crud('POST', 'material/jobMaterial', {
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

         this.addMaterial = function(data, cb) {
            var that = this;
            server.crud('POST', 'material/save', data, function(err, data) {
               if (!!err) {
                  return cb(true, null);
               }
               if ($stateParams.id) {
                  $state.reload();
               } else {
                  $state.go('record.material.list', {
                     id: $stateParams.id
                  });
               }
               return cb(null, true);
            });
         };


         this.updateMaterial = function(data, cb) {
            var that = this;
            server.crud('POST', 'material/update', data, function(err, data) {
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
               $state.go('record.material.list', {
                  id: $stateParams.id
               });
            }
         };

         this.deleteMaterial = function(data, cb) {
            var that = this;
            server.crud('POST', 'material/delete', data, function(err, data) {
               if (!!err) {
                  return cb(true, null);
               }
               if ($stateParams.id) {
                  $state.reload();
               } else {
                  $state.go('record.material.list', {
                     id: $stateParams.id
                  });
               }
            });
         };


      }
   ]);
