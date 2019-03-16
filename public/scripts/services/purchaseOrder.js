'use strict';


myApp
   .service('purchaseOrderService', ['server', '$q', '$state', function(server, $q, $state) {
      var user = {};

      this.modelData = {};
      this.modelDataIndex = -1;
      this.list = function() {
         var deferred = $q.defer();
         var pageData = [];
         server.crud('GET', 'purchaseOrder', null, function(err, data) {
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
         server.crud('POST', 'purchaseOrder/save', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            console.log('purchaseOrder/save', data);
            if (data)
               $state.go('record.purchaseOrder.detail', {
                  id: data
               });
            that.modelDataIndex = -1;
            that.modelData = {};
            return cb(null, true);
         });
      };

      this.updateTotal = function(data, cb) {
         var that = this;
         server.crud('POST', 'purchaseOrder/updateTotal', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            return cb(null, true);
         });
      };

      this.updatePOStatus = function(data, cb) {
         console.log(data);
         var that = this;
         server.crud('POST', 'purchaseOrder/updatePOStatus', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            return cb(null, true);
         });
      };

      this.cancel = function() {
         $state.go('record.purchaseOrder.list');
      };

      this.delete = function(data, cb) {
         server.crud('POST', 'purchaseOrder/delete', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            $state.reload();
            return cb(null, true);
         });
      };

   }]);
