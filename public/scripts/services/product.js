'use strict';


myApp
   .service('productService', ['server', '$q', '$state', function(server, $q, $state) {
      var user = {};

      this.modelData = {};
      this.modelDataIndex = -1;
      this.list = function() {
         var deferred = $q.defer();
         var pageData = [];
         server.crud('GET', 'product', null, function(err, data) {
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
         server.crud('POST', 'product/save', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            that.modelDataIndex = -1;
            that.modelData = {};
            $state.go('master.product.list');
            return cb(null, true);
         });
      };

      this.cancel = function() {
         $state.go('master.product.list');
      };

      this.delete = function(data, cb) {
         var that = this;
         server.crud('POST', 'product/delete', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            $state.reload();
            return cb(null, true);
         });
      };

   }]);
