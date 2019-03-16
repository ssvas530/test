'use strict';


myApp
   .service('supplierService', ['server', '$q', '$state', function(server, $q, $state) {
      var user = {};

      this.modelData = {};
      this.modelDataIndex = -1;
      this.list = function() {
         var deferred = $q.defer();
         var pageData = [];
         server.crud('GET', 'supplier', null, function(err, data) {
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
         server.crud('POST', 'supplier/save', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            that.modelDataIndex = -1;
            that.modelData = {};
            $state.go('master.supplier.list');
            return cb(null, true);
         });
      };

      this.cancel = function() {
         $state.go('master.supplier.list');
      };

      this.delete = function(data, cb) {
         server.crud('POST', 'supplier/delete', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            $state.reload();
            return cb(null, true);
         });
      };

   }]);
