'use strict';


myApp
   .service('productPurchaseService', ['server', '$q', '$state', '$stateParams',
      function(server, $q, $state, $stateParams) {
         var user = {};

         this.modelData = {};
         this.modelDataIndex = -1;

         this.productPurchaseList = function(id) {
            if (!id) {
               return [];
            }
            var deferred = $q.defer();
            var pageData = [];
            server.crud('POST', 'productPurchase/poProduct', {
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

         this.purchaseOrderInfo = function(id) {
            var deferred = $q.defer();
            var pageData = [];
            server.crud('POST', 'purchaseOrder/purchaseOrderInfo', {
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

         this.add = function(data, cb) {
            var that = this;
            server.crud('POST', 'productPurchase/save', data, function(err, data) {
               if (!!err) {
                  return cb(true, null);
               }
               if ($stateParams.id) {
                  $state.reload();
               } else {
                  $state.go('record.productPurchase.list', {
                     id: $stateParams.id
                  });
               }
               return cb(null, true);
            });
         };


         this.update = function(data, cb) {
            var that = this;
            server.crud('POST', 'productPurchase/update', data, function(err, data) {
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
               $state.go('record.productPurchase.list', {
                  id: $stateParams.id
               });
            }
         };

         this.delete = function(data, cb) {
            var that = this;
            server.crud('POST', 'productPurchase/delete', data, function(err, data) {
               if (!!err) {
                  return cb(true, null);
               }
               if ($stateParams.id) {
                  $state.reload();
               } else {
                  $state.go('record.productPurchase.list', {
                     id: $stateParams.id
                  });
               }
            });
         };


      }
   ]);
